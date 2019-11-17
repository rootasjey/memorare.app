<script>
  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import IconButton   from '../components/IconButton.svelte';
  import QuoteCard    from '../components/QuoteCard.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import RectButton   from '../components/RectButton.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import TextLink     from '../components/TextLink.svelte';
  import { settings } from '../settings';

  import {
    client,
    CREATE_QUOTIDIAN,
    DELETE_QUOTE,
    PUBLISHED_QUOTES_ADMIN,
  } from '../data';

  import { handle } from '../errors';
  import { canI }   from '../settings';
  import { status } from '../utils';

  let hasMoreData     = true;
  let limit           = 10;
  let order           = 1;
  let publishedQuotes = [];
  let queryStatus     = status.loading;
  let selectedQuoteId = -1;
  let skip            = 0;

  $: spinnerVisibility = queryStatus === status.loading ? 'visible' : 'hidden';

  main();

  function main() {
    const canIManageQuotes = canI('manageQuote');

    if (!canIManageQuotes) {
      setTimeout(() => {
        navigate('/shallnotpass');
      }, 500);

      return;
    }

    fetchPublishedQuotes();
  }

  async function fetchPublishedQuotes() {
    queryStatus = status.loading;

    try {
      const response = await client.query({
        query: PUBLISHED_QUOTES_ADMIN,
        variables: { lang: settings.getValue('lang'), limit, order, skip },
        fetchPolicy: 'network-only',
      });

      publishedQuotes = response.data.publishedQuotesAdmin.entries;

      const { pagination } = response.data.publishedQuotesAdmin;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      queryStatus = status.completed;

    } catch (error) {
      queryStatus = status.error;
      handle(error);
    }
  }

  async function onRefresh() {
    skip = 0;
    selectedQuoteId = -1;
    main();
  }

  async function onDelete(id) {
    try {
      const response = await client.mutate({
        mutation: DELETE_QUOTE,
        variables: { id },
      });

      const deletedQuote = response.data.deleteQuote;

      publishedQuotes = publishedQuotes.filter((quote) => quote.id !== deletedQuote.id);

      show({
        text: 'The quote has successfully been deleted',
        type: 'success',
      });

    } catch (error) {
      handle(error);
      show({
        text: `Couldn't delete the quote. Try again in a moment.`,
        type: 'error',
      });
    }
  }

  async function onCreateQuotidian(quote) {
    try {
      const response = await client.mutate({
        mutation: CREATE_QUOTIDIAN,
        variables: { lang: quote.lang, quoteId: quote.id },
      });

      show({
        text: 'The quote has successfully been added to quotidian',
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  async function onFetchMore() {
    try {
      const lang = settings.getValue('lang');

      const response = await client.query({
        query: PUBLISHED_QUOTES_ADMIN,
        variables: { lang, limit, order, skip },
        fetchPolicy: 'network-only',
      });

      const { entries, pagination } = response.data.publishedQuotesAdmin;

      hasMoreData = pagination.hasNext;
      limit       = pagination.limit;
      skip        = pagination.nextSkip;

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

  function onToggleOrder() {
    order = order === 1 ? -1 : 1;
    onRefresh();
  }

  function onClickAuthor(id) {
    navigate(`/author/${id}`);
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

  .quote__header__icons__slot {
    display: flex;
  }

  .row-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
</style>

<div class="published-quotes-page">
  <header class="header">
    <h1>Published Quotes</h1>
    <span class="header__subtext">Quotes discoverable by everyone.</span>
  </header>

  <div class="published-quotes-page__content">
    {#if queryStatus === status.loading}
      <div>
        <Spinner visibility={spinnerVisibility} />
        <span>Loading published quotes...</span>
      </div>
    {:else if queryStatus === status.completed}
      <div class="content__buttons-container">
        <div class="row-buttons">
          {#if order === 1}
            <IconButton
              on:click={onToggleOrder}>
              <svg
                slot="svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#fff"
                viewBox="0 0 24 24">
                <path d="M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-12h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z"/>
              </svg>
            </IconButton>
          {:else}
            <IconButton
              on:click={onToggleOrder}>
              <svg
                slot="svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#fff"
                viewBox="0 0 24 24">
                <path d="M6 3l-6 8h4v10h4v-10h4l-6-8zm16 6h-8v-2h8v2zm2-6h-10v2h10v-2zm-4 8h-6v2h6v-2zm-2 4h-4v2h4v-2zm-2 4h-2v2h2v-2z"/>
              </svg>
            </IconButton>
          {/if}
        </div>

        <RectButton outlined={true} value="refresh" on:click={onRefresh} />
      </div>

      <div class="list-published-quotes">
        <div class="list-published-quotes__content">
          {#each publishedQuotes as quote, index}
            <div>
              <QuoteCard
                content="{quote.name}"
                authorName="{quote.author.name}"
                margin="20px"
                tag="{quote.topics.length > 0 ? quote.topics[0] : ''}"
                on:click={() => onSelectQuote(quote.id)}
                on:clickauthor={() => onClickAuthor(quote.author.id)}
                selected={selectedQuoteId === quote.id}>

                <div slot="quoteHeaderIcons" class="quote__header__icons__slot">
                  <IconButton
                    margin="5px"
                    on:click={() => onDelete(quote.id)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                    </svg>
                  </IconButton>

                  <IconButton margin="5px"
                    on:click={() => onCreateQuotidian(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/>
                    </svg>
                  </IconButton>
                </div>
              </QuoteCard>
            </div>
          {:else}
            <div>There's currently no published quotes.</div>
          {/each}
        </div>


        {#if hasMoreData}
          <div class="list-published-quotes__footer">
            <TextLink text="Load more..." on:click={onFetchMore} />
          </div>
        {/if}
      </div>
    {:else}
      <div>Tere was an error when retrieving published quotes.</div>
    {/if}
  </div>
</div>
