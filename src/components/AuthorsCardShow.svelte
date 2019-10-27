<script>
  import { onDestroy }  from 'svelte';
  import { fly }        from 'svelte/transition';

  import {
    client,
    TINY_LIST_AUTHORS,
  } from '../data';


  let backgroundStyle = 'background-color: transparent;';
  let colorBackgroundStyle = 'opacity: .8';

  let authors = [];
  let authorQuote = '';
  let authorQuoteFontStyle = 'font-size: 2em;';
  let showAuthorQuote = true;

  // Authors slideshow
  let index = 0;
  let timeoutId = 0;

  const intervalId = window.setInterval(() => {
    index = (index + 1) % authors.length;

    colorBackgroundStyle = 'opacity: 1';
    showAuthorQuote = false;

    timeoutId = window.setTimeout(() => {
      const author = authors[index];

      backgroundStyle = `background-image: url("${author.imgUrl}");`;
      colorBackgroundStyle = 'opacity: .8';

      authorQuote = author.quotes.length > 0 ?
        author.quotes[0].name : '';

      authorQuoteFontStyle = authorQuote.length > 100 ?
        'font-size: 1.2em; font-weight: lighter; ' :
        'font-size: 2em; font-weight: bold; ';

      showAuthorQuote = true;

    }, 2000);

  }, 10000);

  onDestroy(() => {
    window.clearInterval(intervalId);
    window.clearTimeout(timeoutId);
  });

  // Authors request
  (async function () {
    const response = await client.query({ query: TINY_LIST_AUTHORS });

    authors = response.data.listAuthors.entries
      .filter((author) => author.imgUrl !== null);

    backgroundStyle = `background-image: url("${authors[0].imgUrl}")`;
    authorQuote = authors[0].quotes.length > 0 ?
      authors[0].quotes[0].name : '';
  })();

</script>

<style>
  .signin__card-left {
    height: 510px;
    width: 400px;
    padding: 20px;

    background-color: #706fd3;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    background-repeat: no-repeat;

    position: relative;

    animation-name: scaleBg;
    animation-duration: 10s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
  }

  @media (max-width: 880px) {
    .signin__card-left {
      height: 200px;
      border-radius: 5px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .signin__card-left__bg-color {
    height: 100%;
    width: 100%;
    background-color: #706fd3;

    position: absolute;
    top: 0;
    left: 0;

    opacity: .8;
    transition: 3s;
  }

  @keyframes scaleBg {
    0% {
      background-size: 100%;
    }
    100% {
      background-size: 110%;
    }
  }

  .signin__card-left__quote {
    height: 90%;
    position: absolute;

    color: white;
    font-size: 2em;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

</style>

<div class="signin__card-left" style="{backgroundStyle}">
  <div class="signin__card-left__bg-color" style="{colorBackgroundStyle}">
  </div>

  {#if showAuthorQuote}
    <div class="signin__card-left__quote"
      style="{authorQuoteFontStyle}"
      transition:fly="{{ y: 20, duration: 500 }}">
      <span>{authorQuote}</span>
    </div>
  {/if}
</div>