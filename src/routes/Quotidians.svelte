<script>
  import { navigate } from 'svelte-routing';

  import IconButton   from '../components/IconButton.svelte';
  import Input        from '../components/Input.svelte';
  import QuoteCard    from '../components/QuoteCard.svelte';
  import RectButton   from '../components/RectButton.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import TextLink     from '../components/TextLink.svelte';
  import { status }   from '../utils';

  import {
    client,
    DELETE_QUOTIDIAN,
    QUOTIDIANS,
    UPDATE_QUOTIDIAN,
  } from '../data';

  import { handle } from '../errors';
  import { canI } from '../settings';

  let domQuotidians;
  let hasMoreData     = true;
  let limit           = 5;
  let order           = 1;
  let quotidians      = [];
  let selectedQuoteId = -1;
  let skip            = 0;
  let pageStatus      = status.loading;

  main();

  function main() {
    const canIManageQuotidian = canI('manageQuotidian');

    if (!canIManageQuotidian) {
      setTimeout(() => {
        navigate('/shallnotpass');
      }, 500);

      return;
    }

    fetchQuotidians();
  }

  async function fetchQuotidians() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: QUOTIDIANS,
        variables: { limit, order, skip },
        fetchPolicy: 'network-only',
      });

      quotidians = response.data.quotidians.entries;

      const { pagination } = response.data.quotidians;
      hasMoreData = pagination.hasNext;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      pageStatus = status.completed;

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't fetch quotidians.`,
        type: 'error',
      });

      pageStatus = status.error;
      handle(error);
    }
  }

  async function onRefresh() {
    pageStatus = status.loading;
    skip = 0;

    try {
      const response = await client.query({
        query: QUOTIDIANS,
        variables: { limit, order, skip },
        fetchPolicy: 'network-only',
      });

      quotidians = [];
      quotidians = response.data.quotidians.entries;

      const { pagination } = response.data.quotidians;

      hasMoreData = true;
      limit       = pagination.limit;
      pageStatus  = status.completed;
      skip        = pagination.nextSkip;

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't refresh quotidians.`,
        type: 'error',
      });

      pageStatus = status.error;
      handle(error);
    }
  }

  async function onDelete(id) {
    try {
      const response = await client.mutate({
        mutation: DELETE_QUOTIDIAN,
        variables: { id },
      });

      const { deleteQuotidian } = response.data;

      quotidians = quotidians.filter((quotidian) => quotidian.id !== id);

      show({ text: `Quotidian successfully deleted.`, type: 'success' });

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't delete quotidian.`,
        type: 'error',
      });

      handle(error);
    }
  }

  async function onValidateNewDate(quotidian, index) {
    const { id, date: prevDate } = quotidian;
    const dateInput = domQuotidians.querySelector(`.quotidian[data-id="${id}"] .date-input`);

    if (!dateInput) { return; }

    const targetDate = dateInput.value;

    try {
      const response = await client.mutate({
        mutation: UPDATE_QUOTIDIAN,
        variables: { id, targetDate },
      });

      const { updateQuotidian } = response.data;

      show({ text: `Successfully updated quotidian date.` });

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't update quotidian date.`,
        type: 'error',
      });

      dateInput.value = prevDate;
      handle(error);
    }
  }

  async function onResetDate(quotidian, index) {
    const dateInput = domQuotidians
      .querySelector(`.quotidian[data-id="${quotidian.id}"] .date-input`);

    if (!dateInput) { return; }

    dateInput.value = quotidian.date;
  }

  async function onLoadMore() {
    try {
      const response = await client.query({
        query: QUOTIDIANS,
        variables: { limit, order, skip },
        fetchPolicy: 'network-only',
      });

      const { entries, pagination } = response.data.quotidians;

      hasMoreData = pagination.hasNext;
      limit       = pagination.limit;
      skip        = pagination.nextSkip;

      quotidians = [...quotidians, ...entries];

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't fetch more quotidians.`,
        type: 'error',
      });

      handle(error);
    }
  }

  function onSelectQuote(id) {
    selectedQuoteId = id;
  }

  function onClickAuthor(id) {
    navigate(`/author/${id}`);
  }

  function onToggleOrder() {
    order = order === 1 ? -1 : 1;
    onRefresh();
  }
</script>

<style>
 .content__buttons-container {
    margin: 25px 0;
  }

  .header__subtext {
    font-size: 1.2em;
    font-weight: 100;

    margin-top: -10px;
  }

  .list-quotidians {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 50px;
  }

  .list-quotidians__content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .list-quotidians__footer {
    padding: 20px 0;
  }

  .quote__header__icons__slot {
    display: flex;
  }

  .quotidians-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .quotidians-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .quotidians-page__header {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 50px;
  }

  .row-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
</style>

<div class="quotidians-page">
  <header class="quotidians-page__header">
    <h1>Quotidians</h1>
    <span class="header__subtext">The next daily quotes.</span>
  </header>

  <div class="quotidians-page__content">
    {#if pageStatus === status.loading}
      <div>
        <Spinner color="#f56498" visibility={pageStatus === status.loading} />
        <span>Loading published quotes...</span>
      </div>
    {:else if  pageStatus === status.completed}
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

      <div class="list-quotidians" bind:this={domQuotidians}>
        <div class="list-quotidians__content">
          {#each quotidians as quotidian, index}
            <div>
              <QuoteCard
                backgroundColor="#706fd3"
                color="white"
                content="{quotidian.quote.name}"
                authorName="{quotidian.quote.author.name}"
                on:click={() => onSelectQuote(quotidian.id)}
                on:clickauthor={() => onClickAuthor(quotidian.quote.author.id)}
                selected={selectedQuoteId === quotidian.id}
                tag="{(new Date(quotidian.date)).toLocaleDateString()}">

                <div slot="quoteHeaderIcons" class="quote__header__icons__slot">
                  <IconButton margin="5px"
                    on:click={() => onDelete(quotidian.id)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg slot="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                    </svg>
                  </IconButton>
                </div>
              </QuoteCard>
            </div>
          {:else}
            <div>There's currently no quotidians.</div>
          {/each}
        </div>

        {#if hasMoreData}
          <div class="list-quotidians__footer">
            <TextLink text="Load more..." on:click={onLoadMore} />
          </div>
        {/if}
      </div>
    {:else}
      <div>There was an error when retreiving quotidians.</div>
    {/if}
  </div>
</div>
