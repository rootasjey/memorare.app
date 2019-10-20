<script>
  import { fly } from 'svelte/transition';

  import {
    client,
    RANDOM_QUOTE,
  } from '../data'

  import Button       from '../components/Button.svelte';
  import QuoteCard    from '../components/QuoteCard.svelte';
  import IconButton   from '../components/IconButton.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import { handle }   from '../errors';
  import { settings } from '../settings';

  let quote = {};
  let pageStatus = 'loading';
  let animate = false;

  fetchRandomQuote();

  async function fetchRandomQuote() {
    try {
      pageStatus = 'loading';

      const result = await client.query({
        query: RANDOM_QUOTE,
        variables: { lang: settings.getValue('lang') },
        fetchPolicy: 'no-cache',
      });

      animate = false;
      quote = result.data.randomQuote;
      pageStatus = 'completed';

    } catch (error) {
      handle(error);
      pageStatus = 'error';
    }
  }

  function onShare(quote) {
    console.log('share quote')
  }

  function onGetAnother() {
    animate = true;
    fetchRandomQuote();
  }
</script>

<style>
  .quote-random__page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .refresh-container {
    margin: 30px 0;
  }

  .animateIn {
    position: relative;
    top: 0;

    animation-duration: 1s;
    animation-name: slideIn;
    animation-fill-mode: forwards;
  }

  .animateOut {
    position: relative;
    top: 0;

    animation-duration: 1s;
    animation-name: slideOut;
    animation-fill-mode: forwards;
  }

  .hidden {
    display: none;
  }

  @keyframes slideOut {
    0% {
      top: 0;
      opacity: 1;
    }
    100% {
      top: 40px;
      opacity: 0;
    }
  }

  @keyframes slideIn {
    0% {
      top: 40px;
      opacity: 0;
    }
    100% {
      top: 0;
      opacity: 1;
    }
  }
</style>

<div class="quote-random__page"
    transition:fly={{ y: 10, duration: 200 }} >
  <h1>Here is a random quote ❤ </h1>

  <div class:hidden={pageStatus !== 'loading'}>
    <Spinner visibility={pageStatus === 'loading' ? 'visible' : 'hidden'} />
    <span>Getting a random quote from the cyber-space...</span>
  </div>

  {#if pageStatus === 'error'}
    <h1>Couldn't perform the request.</h1>
  {:else if quote.name }
    <div
      class:animateOut={animate === true}
      class:animateIn={animate === false}>
      <QuoteCard
        content="{quote.name}"
        authorName="{quote.author.name}"
        tag="{quote.topics.length > 0 ? quote.topics[0] : ''}">
        <div slot="quoteHeaderIcons" class="quote__header__icons__slot">
          <IconButton
            margin="5px"
            onClick={() => onShare(quote._id)}
            backgroundColor="#f56498"
            elevation={1} >
            <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
            </svg>
          </IconButton>
        </div>
      </QuoteCard>
    </div>

    <div class="refresh-container">
      <Button value="Bring me another..." outlined="{true}" onClick={onGetAnother} />
    </div>
  {/if}
</div>
