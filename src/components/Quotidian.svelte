<script>
  import { navigate } from 'svelte-routing';

  import {
    client,
    QUOTIDIAN,
  } from '../data';

  import { handle }   from '../errors'
  import { settings } from '../settings';
  import { status }   from '../utils'

  import IconButton   from './IconButton.svelte';
  import { show }     from './Snackbar.svelte'

  export let top = '0';

  let authorImgUrl = '';
  let baseFontSize = 2;
  let bgImg = '';
  let pageStatus = status.idle;
  let quotidian = {};

  let fontSize = '';

  let style = `
    top: ${top};
  `;

  main();

  function main() {
    fetchQuotidian();
  }

  async function fetchQuotidian() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: QUOTIDIAN,
        fetchPolicy: 'network-only',
      });

      quotidian = response.data.quotidian;
      pageStatus = status.completed;

      authorImgUrl = quotidian.quote.author.imgUrl ?
        quotidian.quote.author.imgUrl :
        '/img/monk.png';

      bgImg = `background-image: url('${authorImgUrl}');`;

      let computedFontSize = 470 / quotidian.quote.name.length;
      if (computedFontSize < 1.5) { computedFontSize = 1.5; }
      if (computedFontSize > 2.5) { computedFontSize = 2.5; }
      computedFontSize = parseFloat(computedFontSize).toPrecision(2);

      fontSize = `font-size: ${computedFontSize}em;`;

    } catch (error) {
      pageStatus = status.error;
      handle(error);
    }
  };

  async function onLike(quote) {
    if (!settings.getValue('id')) {
      show({
        text: 'You must be logged in to like a quote.',
        actions: [
          {
            text: 'Log me in!',
            handler: () => navigate('/signin'),
          }
        ]
      });
      return;
    }

    // console.log(`like quote ${quote}`);
  }

  async function onShare(quote) {
    // console.log('show share ui');
  }

  function onClickAuthor() {
    navigate(`/author/${quotidian.quote.author.id}`);
  }
</script>

<style>
  .quotidian {
		background: #706fd3;
		border-radius: 2px;
    color: white;
    cursor: pointer;

		padding: 0 50px;
    width: 50%;

    position: relative;

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quotidian:hover {
    filter: brightness(95%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quotidian:active {
    filter: brightness(90%);
    transform: translateY(3px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  footer {
    padding: 20px 0;
  }

  header {
    display: flex;
    padding: 20px 0;
  }

  .quotidian__error {
    padding: 40px;
  }

  .quotidian__loading {
    padding: 50px;
    text-transform: uppercase;
  }

  .quotidian__name {
    font-size: 2.5em; /* dynamic font size */
    font-weight: 600;
  }

  .author {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .author-img {
    width: 30px;
    height: 30px;

    background-color: #fff;
    border-radius: 50%;
    background-size: cover;

    margin-right: 10px;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");

    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .author-img:hover {
    filter: brightness(98%);
    transform: translateY(1px);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .author-img:active {
    filter: brightness(96%);
    transform: translateY(2px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  @media (max-width: 670px) {
    .quotidian__name {
      font-size: 1.5em;
    }
  }

  @media (max-width: 310px) {
    .quotidian__name {
      font-size: 1em;
      font-weight: 200;
    }
  }
</style>

<div class="quotidian" style="{style}">
  {#if pageStatus === status.loading}
     <div class="quotidian__loading">
      <div class="quotidian__name">Loading quote...</div>
    </div>
  {:else if pageStatus === status.completed}
    <div class="quotidian__content">
      <header>
        <IconButton
          margin="5px"
          on:click={() => onLike(quotidian)}
          backgroundColor="#f56498"
          elevation={2} >
          <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M6.28 3c3.236.001 4.973 3.491 5.72 5.031.75-1.547 2.469-5.021 5.726-5.021 2.058 0 4.274 1.309 4.274 4.182 0 3.442-4.744 7.851-10 13-5.258-5.151-10-9.559-10-13 0-2.676 1.965-4.193 4.28-4.192zm.001-2c-3.183 0-6.281 2.187-6.281 6.192 0 4.661 5.57 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-4.011-3.097-6.182-6.274-6.182-2.204 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248z"/>
          </svg>
        </IconButton>

        <IconButton
          margin="5px"
          on:click={() => onShare(quotidian)}
          backgroundColor="#f56498"
          elevation={2} >
          <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
          </svg>
        </IconButton>
      </header>

      <div class="quotidian__name" style="{fontSize}">
        {quotidian.quote.name}
      </div>

      <footer class="quotidian__footer">
        <div class="author" on:click={onClickAuthor}>
          <div class="author-img" style="{bgImg}"></div>
          <span> {quotidian.quote.author.name} </span>
        </div>

        {#if quotidian.quote.references.length}
          <p>{quotidian.quote.references[0].name}</p>
        {/if}
      </footer>
    </div>
  {:else}
    <div class="quotidian__error">
      <div class="quotidian__name">An error occurred while loading :(</div>
    </div>
  {/if}
</div>
