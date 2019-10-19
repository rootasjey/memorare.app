<script>
  import { getClient, query } from 'svelte-apollo';
  import { navigate }         from 'svelte-routing';

  import {
    client,
    QUOTIDIAN
  } from '../data';
  import { settings } from '../settings';
  import IconButton   from './IconButton.svelte';
  import { show }     from './Snackbar.svelte'

  const quotidian = query(client, { query: QUOTIDIAN });

  export let top = '0';

  let style = `
    top: ${top};
  `;

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

    console.log(`like quote ${quote}`);
  }

  async function onShare(quote) {
    console.log('show share ui');
  }
</script>

<style>
  .quote-container {
		background: #706fd3;
		border-radius: 2px;
    color: white;
    cursor: pointer;

    margin: auto;
		padding: 0 50px;
    width: 50%;

    position: relative;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quote-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  footer {
    text-align: right;
    padding: 20px 0;
  }

  header {
    display: flex;
    padding: 20px 0;
  }

  header svg {
    position: relative;
    top: 10px;
  }

  .quote-loading {
    padding: 50px;
    text-transform: uppercase;
  }
</style>

<div class="quote-container" style="{style}">
  {#await $quotidian}
    <!-- $quotidian is pending -->
    <div class="quote-loading">
      <h1>Loading quote...</h1>
    </div>
  {:then result}
    <!-- $quotidian was fulfilled -->
    <div class="quote-content">
      <header>
        <IconButton
          margin="5px"
          onClick={() => onLike(result.data.quotidian)}
          backgroundColor="#f56498"
          elevation={1} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M6.28 3c3.236.001 4.973 3.491 5.72 5.031.75-1.547 2.469-5.021 5.726-5.021 2.058 0 4.274 1.309 4.274 4.182 0 3.442-4.744 7.851-10 13-5.258-5.151-10-9.559-10-13 0-2.676 1.965-4.193 4.28-4.192zm.001-2c-3.183 0-6.281 2.187-6.281 6.192 0 4.661 5.57 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-4.011-3.097-6.182-6.274-6.182-2.204 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248z"/>
          </svg>
        </IconButton>

        <IconButton
          margin="5px"
          onClick={() => onShare(result.data.quotidian)}
          backgroundColor="#f56498"
          elevation={1} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
          </svg>
        </IconButton>
      </header>

      <h1 class="quote-name"> {result.data.quotidian.quote.name} </h1>

      <footer class="quote-footer">
        <h4>{result.data.quotidian.quote.author.name}</h4>

        {#if result.data.quotidian.quote.references.length}
          <p>{result.data.quotidian.quote.references[0].name}</p>
        {/if}
      </footer>
    </div>
  {:catch error}
    <!-- $quotidian was rejected -->
    <div class="quote-error">
      <h1>An error occurred while loading :(</h1>
      <h4>{error}</h4>
    </div>
  {/await}
</div>
