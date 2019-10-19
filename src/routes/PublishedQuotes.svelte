<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Button       from '../components/Button.svelte';
  import IconButton   from '../components/IconButton.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import TextLink     from '../components/TextLink.svelte';
  import { settings } from '../settings';

  import {
    client,
    CREATE_QUOTIDIAN,
    PUBLISHED_QUOTES_ADMIN,
  } from '../data';

  import { handle } from '../errors';

  let hasMoreData     = true;
  let limit           = 10;
  let publishedQuotes = [];
  let queryStatus     = 'loading'; // loading || completed || error
  let selectedQuoteId = -1;
  let skip            = 0;

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryPublishedQuotes = query(client, {
    query: PUBLISHED_QUOTES_ADMIN,
    variables: { lang: settings.getValue('lang'), limit, skip },
  });

  (async function fetchPublishedQuotes() {
    try {
      queryStatus = 'loading';

      const response = await queryPublishedQuotes.result();
      publishedQuotes = response.data.publishedQuotesAdmin.entries;

      const { pagination } = response.data.publishedQuotesAdmin;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      queryStatus = 'completed';

    } catch (error) {
      queryStatus = 'error';
      handle(error);
    }
  })();

  async function onRefresh() {
    queryStatus = 'loading';
    skip = 0;

    try {
      // NOTE
      // 2 issues:
      // ~~~~~~~~~
      // 1.Svelte does not want to update properly the array with a async func &
      // if the re-assignment is fired immediately
      //
      // 2.svele-apollo returns different data with the same query
      setTimeout(async () => {
        const queryPublishedQuotes2 = query(client, {
          query: PUBLISHED_QUOTES_ADMIN,
          variables: { lang: settings.getValue('lang'), limit, skip },
        });

        const resp = await queryPublishedQuotes2.refetch({ limit, skip });

        publishedQuotes = resp.data.publishedQuotesAdmin.entries;

        const { pagination } = resp.data.publishedQuotesAdmin;
        limit = pagination.limit;
        skip = pagination.nextSkip;

        queryStatus = 'completed';
      }, 100);

    } catch (error) {
      queryStatus = 'error';
      handle(error);
    }
  }

  async function onDelete(quote) {
    // Code to directly add to published quotes

    show({
      text: 'Delete published quote',
      actions: [
        {
          text: 'UNDO',
          handler: () => {

          }
        }
      ]
    });
  }

  async function onCreateQuotidian(quote) {
    try {
      const response = await mutate(client, {
        mutation: CREATE_QUOTIDIAN,
        variables: { lang: quote.lang, quoteId: quote._id },
      });

      show({
        text: 'The quote has successfully been added to quotidian',
        actions: [ { text: 'OK' }]
      });

    } catch (error) {
      handle(error);
    }
  }

  async function onLoadMore() {
    try {
      const lang = settings.getValue('lang');

      const q3 = await query(client, {
        query: PUBLISHED_QUOTES_ADMIN,
        variables: { lang, limit, skip },
      });

      const resp = await q3.result();
      const { publishedQuotesAdmin: { entries, pagination } } = resp.data;

      hasMoreData = pagination.hasNext;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      publishedQuotes = [...publishedQuotes, ...entries];

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't fetch more published quotes.`,
        type: 'error',
      });

      handle(error);
    }
  }

  function onSelectQuote(id) {
    selectedQuoteId = id;
  }
</script>

<style>
  .published-quotes-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

 .content__buttons-container {
    margin: 25px 0;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 50px;
  }

  .header__subtext {
    font-size: 1.2em;
    font-weight: 100;

    margin-top: -10px;
  }

  .list-published-quotes {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 50px;
  }

  .list-published-quotes__content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .list-published-quotes__footer {
    padding: 20px 0;
  }

  .published-quotes-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .quote {
    margin: 10px;
    padding: 30px;

    min-height: 320px;
    max-width: 240px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);
    border: 2px solid transparent;
    border-radius: 10px;

    position: relative;
    transition: .3s;
  }

  .quote:hover {
    transform: scale(1.050);
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .quote.selected {
    border: 2px solid #f56498;
  }

  .quote__content {
    text-align: center;
    font-size: 1.5em;
    font-weight: 300;

    max-height: 170px;
    overflow-y: auto;
  }

  .quote__footer {
    position: absolute;
    align-self: flex-start;
    bottom: 0;

    padding-bottom: 10px;

    opacity: 0;
    transition: .3s;
  }

  .quote:hover .quote__footer,
  .quote.selected .quote__footer {
    opacity: 1;
    transition: .3s;
  }

  .quote__footer__author {
    align-items: center;
    display: flex;
    width: 100%;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .quote__footer__author-img {
    height: 30px;
    width: 30px;

    border-radius: 50%;
    background-color: #353b48;

    margin-right: 10px;
  }

  .quote__header {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
  }

  .quote__header__icons {
    position: absolute;
    left: 20px;
    top: 20px;

    display: flex;
  }

  .quote__header__icons svg {
    position: relative;
    top: 10px;
  }

  .quote__header__topics {
    color: white;
    background-color: #f56498;
    font-weight: 700;

    padding: 5px;
    border-radius: 5px;

    cursor: pointer;

    position: absolute;
    top: -15px;
    right: 10px;

    transition: .3s;
  }

  .quote__header__topics:hover {
    background-color: #cc5380;
    transition: .3s;
  }

</style>

<div class="published-quotes-page">
  <header class="header">
    <h1>Published Quotes</h1>
    <span class="header__subtext">Quotes discoverable by everyone.</span>
  </header>

  <div class="published-quotes-page__content">
    {#if queryStatus === 'loading'}
      <div>
        <Spinner visibility={spinnerVisibility} />
        <span>Loading published quotes...</span>
      </div>
    {:else if queryStatus === 'completed'}
      <div class="content__buttons-container">
        <Button outlined={true} value="refresh" onClick={() => onRefresh()} />
      </div>

      <div class="list-published-quotes">
        <div class="list-published-quotes__content">
          {#each publishedQuotes as quote, index}
            <div class="quote"
              class:selected={selectedQuoteId === quote._id}
              on:click={() => onSelectQuote(quote._id)}
              transition:fly={{ y: 10, duration: 200 * index }} >

              <header class="quote__header">
                <div class="quote__header__icons">
                  <IconButton
                    margin="5px"
                    onClick={() => onDelete(quote._id)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                    </svg>
                  </IconButton>

                  <IconButton margin="5px"
                    onClick={() => onCreateQuotidian(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/>
                    </svg>
                  </IconButton>
                </div>

                {#if quote.topics && quote.topics.length > 0}
                  <div class="quote__header__topics">
                    <span> {quote.topics[0]} </span>
                  </div>
                {/if}
              </header>

              <div class="quote__content">
                {quote.name}
              </div>

              <div class="quote__footer">
                <div class="quote__footer__author">
                    <div class="quote__footer__author-img"></div>
                    <span> {quote.author.name} </span>
                </div>
              </div>
            </div>
          {:else}
            <div>There's currently no published quotes.</div>
          {/each}
        </div>


        {#if hasMoreData}
          <div class="list-published-quotes__footer">
            <TextLink text="Load more..." onClick={onLoadMore} />
          </div>
        {/if}
      </div>
    {:else}
      <div>Tere was an error when retrieving published quotes.</div>
    {/if}
  </div>
</div>
