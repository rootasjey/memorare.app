<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Button       from '../components/Button.svelte';
  import IconButton   from '../components/IconButton.svelte';
  import Input        from '../components/Input.svelte';
  import QuoteCard    from '../components/QuoteCard.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import Spinner      from '../components/Spinner.svelte';
  import TextLink     from '../components/TextLink.svelte';

  import {
    client,
    DELETE_QUOTIDIAN,
    QUOTIDIANS,
    UPDATE_QUOTIDIAN,
  } from '../data';

  import { handle } from '../errors';

  let domListQuotidians;
  let hasMoreData         = true;
  let limit               = 5;
  let queryStatus         = 'loading'; // loading || completed || error
  let quotidians          = [];
  let selectedQuoteId     = -1;
  let skip                = 0;

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryQuotidians = query(client, {
    query: QUOTIDIANS,
    variables: { limit, skip },
  });

  (async function fetchQuotidians() {
    try {
      queryStatus = 'loading';
      const response = await queryQuotidians.result();
      quotidians = response.data.quotidians.entries;

      const { pagination } = response.data.quotidians;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      queryStatus = 'completed';

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't fetch quotidians.`,
        type: 'error',
      });

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
      //   if the re-assignment is fired immediately
      // 2.svele-apollo returns different data with the same query
      setTimeout(async () => {
        const q2 = query(client, {
          query: QUOTIDIANS,
          variables: { limit, skip },
        });

        const resp = await q2.result();

        quotidians = resp.data.quotidians.entries;

        const { pagination } = resp.data.quotidians;
        limit = pagination.limit;
        skip = pagination.nextSkip;

        queryStatus = 'completed';
        hasMoreData = true;
      }, 100);

    } catch (error) {
      show({
        actions: [ {text: 'retry'} ],
        text: `Couldn't refresh quotidians.`,
        type: 'error',
      });

      queryStatus = 'error';
      handle(error);
    }
  }

  async function onDelete(id) {
    try {
      const response = await mutate(client, {
        mutation: DELETE_QUOTIDIAN,
        variables: { id },
      });

      const { deleteQuotidian } = response.data;

      quotidians = quotidians.filter((quotidian) => quotidian._id !== id);

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
    const { _id: id, date: prevDate } = quotidian;
    const dateInput = domListQuotidians.querySelector(`.quotidian[data-id="${id}"] .date-input`);

    if (!dateInput) { return; }

    const targetDate = dateInput.value;

    try {
      const response = await mutate(client, {
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
    const dateInput = domListQuotidians.querySelector(`.quotidian[data-id="${quotidian._id}"] .date-input`);

    if (!dateInput) { return; }

    dateInput.value = quotidian.date;
  }

  async function onLoadMore() {
    try {
      const q3 = await query(client, {
        query: QUOTIDIANS,
        variables: { limit, skip },
      });

      const resp = await q3.result();
      const { quotidians: { entries, pagination } } = resp.data;

      hasMoreData = pagination.hasNext;
      limit = pagination.limit;
      skip = pagination.nextSkip;

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

</style>

<div class="quotidians-page">
  <header class="quotidians-page__header">
    <h1>Quotidians</h1>
    <span class="header__subtext">The next daily quotes.</span>
  </header>

  <div class="quotidians-page__content">
    {#await queryQuotidians}
      <div>
        <Spinner visibility={spinnerVisibility} />
        <span>Loading published quotes...</span>
      </div>
    {:then quotidiansResult}
      <div class="content__buttons-container">
        <Button outlined={true} value="refresh" onClick={() => onRefresh()} />
      </div>

      <div class="list-quotidians" bind:this={domListQuotidians}>
        <div class="list-quotidians__content">
          {#each quotidians as quotidian, index}
            <div transition:fly={{ y: 10, duration: 500 }}>
              <QuoteCard
                backgroundColor="#706fd3"
                color="white"
                content="{quotidian.quote.name}"
                authorName="{quotidian.quote.author.name}"
                onClick={() => onSelectQuote(quotidian._id)}
                selected={selectedQuoteId === quotidian._id}
                tag="{(new Date(quotidian.date)).toLocaleDateString()}">

                <div slot="quoteHeaderIcons" class="quote__header__icons__slot">
                  <IconButton margin="5px"
                    onClick={() => onDelete(quotidian._id)}
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
            <TextLink text="Load more..." onClick={onLoadMore} />
          </div>
        {/if}
      </div>
    {:catch error}
      <div>There was an error when retreiving quotidians.</div>
    {/await}
  </div>
</div>
