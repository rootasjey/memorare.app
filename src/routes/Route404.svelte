<script>
  import {
    query,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import IconButton   from '../components/IconButton.svelte';
  import QuoteCard    from '../components/QuoteCard.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import TextLink     from '../components/TextLink.svelte';

  import {
    client,
    RANDOM_QUOTE,
  } from '../data';

  import { settings } from '../settings';

  export let path = '';

  const queryRandomQuote = query(client, {
    query: RANDOM_QUOTE,
    variables: { lang: settings.getValue('lang') },
  });

  function goToHome() {
    navigate('/');
  }

</script>

<style>
  .route404-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .thin-title {
    font-size: 1.4em;
  }

  .txt-pink {
    color: #f56498;
    font-weight: 600;
  }

  .route404-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<div class="route404-page">
  <header>
    <h1>You've lost your way.</h1>
    <p>The path <span class="txt-pink">{path}</span> does not exist.</p>
  </header>

  <div class="route404-page__content">
    <p class="thin-title">Read this cheerup quote</p>

    {#await $queryRandomQuote}
      <div>
        <Spinner />
        <span>Loading temporary quotes...</span>
      </div>
    {:then result}
      <QuoteCard content="{result.data.randomQuote.name}"
        authorName="{result.data.randomQuote.author.name}">
        <div slot="quoteHeaderIcons">
          <IconButton
            backgroundColor="#f56498"
            elevation={1}>
            <svg slot="svg" xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
            </svg>
          </IconButton>
        </div>
      </QuoteCard>

      <TextLink text="Go back on track" onClick={goToHome} />
    {:catch error}
      <h3>Error</h3>
    {/await}
  </div>
</div>