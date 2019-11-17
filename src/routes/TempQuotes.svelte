<script>
  import { navigate } from 'svelte-routing';

  import IconButton from '../components/IconButton.svelte';
  import QuoteCard  from '../components/QuoteCard.svelte';
  import RectButton from '../components/RectButton.svelte';
  import { show }   from '../components/Snackbar.svelte';
  import Spinner    from '../components/Spinner.svelte';
  import TextLink   from '../components/TextLink.svelte';

  import {
    client,
    AUTHOR_BY_NAME,
    DELETE_TEMP_QUOTE_ADMIN,
    SET_VALIDATION_STATUS_ADMIN,
    TEMP_QUOTES_ADMIN,
    VALIDATE_TEMP_QUOTE_ADMIN,
  } from '../data';

  import { handle } from '../errors';
  import { canI }   from '../settings';
  import { status } from '../utils';

  let hasMoreData     = true;
  let limit           = 10;
  let order           = 1;
  let pageStatus      = status.loading;
  let selectedQuoteId = -1;
  let skip            = 0;
  let tempQuotes      = [];

  main();

  function main() {
    const canIManageQuote = canI('validateQuote');

    if (!canIManageQuote) {
      setTimeout(() => {
        navigate('/shallnotpass');
      }, 500);

      return;
    }

    fetchTempQuotes();
  }

  async function fetchTempQuotes() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: TEMP_QUOTES_ADMIN,
        variables: { limit, order, skip },
      });

      tempQuotes = response.data.tempQuotesAdmin.entries;

      const { pagination } = response.data.tempQuotesAdmin;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      pageStatus = status.completed;

    } catch (error) {
      pageStatus = status.error;
      handle(error);
    }
  }

  async function onDelete(quote) {
    const { id } = quote;

    try {
      const response = await client.mutate({
        mutation: DELETE_TEMP_QUOTE_ADMIN,
        variables: { id },
        fetchPolicy: 'no-cache',
      });

      const deleteTempQuote = response.data.deleteTempQuoteAdmin;

      tempQuotes = tempQuotes.filter((tempQuote) => tempQuote.id !== id);

      show({
        text: `Temporary quote successfully deleted`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  async function onEditTempQuote(quote) {
    navigate(`/edit/quote/${quote.id}`);
  }

  async function onLoadMore() {
    try {
      const response = await client.query({
        query: TEMP_QUOTES_ADMIN,
        variables: { limit, order, skip },
        fetchPolicy: 'network-only',
      });

      const { entries, pagination } = response.data.tempQuotesAdmin;

      hasMoreData = pagination.hasNext;
      limit       = pagination.limit;
      skip        = pagination.nextSkip;

      tempQuotes = [...tempQuotes, ...entries];

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't fetch more temporary quotes.`,
        type: 'error',
      });

      handle(error);
    }
  }

  async function onRefresh() {
    pageStatus = status.loading;
    skip = 0;

    try {
      const response = await client.query({
        query: TEMP_QUOTES_ADMIN,
        variables: { limit, order, skip },
        fetchPolicy: 'network-only',
      });

      tempQuotes = response.data.tempQuotesAdmin.entries;

      const { pagination } = response.data.tempQuotesAdmin;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      pageStatus = status.completed;

    } catch (error) {
      pageStatus = status.error;
      handle(error);
    }
  }

  function onSelectQuote(id) {
    selectedQuoteId = id;
  }

  async function onSwitchStatus(quote) {
    const { id, validation: { status: currentStatus } } = quote;

    const status = currentStatus === 'ko' ? 'ok' : 'ko';

    try {
      const response = await client.mutate({
        mutation: SET_VALIDATION_STATUS_ADMIN,
        variables: { id, status },
        fetchPolicy: 'no-cache',
      });

      const { validation } = response.data.setValidationStatusAdmin;

      quote.validation.status = validation.status;

      tempQuotes = tempQuotes;

    } catch (error) {
      handle(error);
    }
  }

  function onToggleOrder() {
    order = order === 1 ? -1 : 1;
    onRefresh();
  }

  async function onValidate(quote) {
    const { id, validation: { status: currentStatus } } = quote;

    try {
      const response = await client.mutate({
        mutation: VALIDATE_TEMP_QUOTE_ADMIN,
        variables: { id },
        fetchPolicy: 'no-cache',
      });

      tempQuotes = tempQuotes.filter((tempQuote) => tempQuote.id !== id);

      show({
        text: `Temporary quote successfully validated`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  async function onClickAuthor(name) {
    try {
      const response = await client.query({
        query: AUTHOR_BY_NAME,
        variables: { name }
      });

      const { id } = response.data.authorByName;
      navigate(`/author/${id}`);

    } catch (error) {
      handle(error);
    }
  }
</script>

<style>
  .content__buttons-container {
    margin: 25px 0;
  }

  .header {
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

  .list-temp-quote {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;

    padding-bottom: 50px;
  }

  .list-temp-quote__content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .list-temp-quote__footer {
    padding: 20px 0;
  }

  .quote {
    margin: 15px;
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

  .quote__header__icons__slot {
    display:flex;
  }

  .row-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }

  .temp-quotes-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .temp-quotes-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<div class="temp-quotes-page">
  <div class="header">
    <h1>Proposed Quotes</h1>
    <span class="header__subtext">Quotes waiting for approval</span>
  </div>

  <div class="temp-quotes-page__content">
      {#if pageStatus === status.loading}
        <div>
          <Spinner color="#f56498" visibility={pageStatus === status.loading} />
          <span>Loading temporary quotes...</span>
        </div>
      {:else if pageStatus === status.completed}
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

        <div class="list-temp-quote">
          <div class="list-temp-quote__content">
            {#each tempQuotes as quote, index}
              <div>
                <QuoteCard
                  content="{quote.name}"
                  authorName="{quote.author.name}"
                  on:click={() => onSelectQuote(quote.id)}
                  on:clickauthor={() => onClickAuthor(quote.author.name)}
                  selected={selectedQuoteId === quote.id}
                  tag="{quote.topics.length > 0 ? quote.topics[0] : ''}">

                  <div slot="quoteHeaderIcons" class="quote__header__icons__slot">
                    <IconButton
                      margin="5px"
                      on:click={() => onDelete(quote)}
                      backgroundColor="#f56498"
                      elevation={1} >
                      <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                      </svg>
                    </IconButton>

                    <IconButton
                      margin="5px"
                      on:click={() => onEditTempQuote(quote)}
                      backgroundColor="#f56498"
                      elevation={1} >
                      <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                      </svg>
                    </IconButton>

                    <IconButton margin="5px"
                      on:click={() => onSwitchStatus(quote)}
                      backgroundColor="#f56498"
                      elevation={1} >
                      <span slot="txt" style="font-size: 1.2em; position: relative; top: 7px;">
                        {`${quote.validation.status}`}
                      </span>
                    </IconButton>

                    <IconButton margin="5px"
                      on:click={() => onValidate(quote)}
                      backgroundColor="#f56498"
                      elevation={1} >
                      <svg slot="svg" xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </IconButton>
                  </div>
                </QuoteCard>
              </div>
            {:else}
              <div>There's currently no temporary quotes. You're all clean!</div>
            {/each}
          </div>

          {#if hasMoreData}
            <div class="list-temp-quote__footer">
              <TextLink text="Load more..." on:click={onLoadMore} />
            </div>
          {/if}
        </div>
      {:else}
        <div>There was an error when retrieving temporary quotes.</div>
      {/if}
  </div>
</div>
