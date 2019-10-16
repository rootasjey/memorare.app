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

        const resp = await q2.refetch({ limit, skip });

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

  .quotidian {
    margin: 10px;
    padding: 30px;

    min-height: 320px;
    max-width: 240px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: #706fd3;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);
    border: 2px solid transparent;
    border-radius: 10px;

    position: relative;
    transition: .3s;
  }

  .quotidian:hover {
    transform: scale(1.050);
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .quotidian.selected {
    border: 2px solid #f56498;
  }

  .quotidian__content {
    color: white;
    text-align: center;
    font-size: 1.5em;
    font-weight: 300;

    max-height: 170px;
    overflow-y: auto;
  }

  .quotidian__footer {
    position: absolute;
    align-self: flex-start;
    bottom: 0;

    padding-bottom: 10px;
    color: white;

    opacity: 0;
    transition: .3s;
  }

  .quotidian:hover .quotidian__footer,
  .quotidian.selected .quotidian__footer {
    opacity: 1;
    transition: .3s;
  }

  .quotidian__footer__author {
    align-items: center;
    display: flex;
    width: 100%;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .quotidian__footer__author-img {
    height: 30px;
    width: 30px;

    border-radius: 50%;
    background-color: white;

    margin-right: 10px;
  }

  .quotidian__header {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
  }

  .quotidian__header__icons {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .quotidian__header__icons svg {
    position: relative;
    top: 10px;
  }

  .quotidian__header__date {
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

  .quotidian__header__date:hover {
    background-color: #cc5380;
    transition: .3s;
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
            <div class="quotidian"
              class:selected={selectedQuoteId === quotidian._id}
              data-id="{quotidian._id}"
              transition:fly={{ y: 10, duration: 500 }}
              on:click={() => onSelectQuote(quotidian._id)}>

              <header class="quotidian__header">
                <div class="quotidian__header__icons">
                  <IconButton margin="5px"
                    onClick={() => onDelete(quotidian._id)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                    </svg>
                  </IconButton>
                </div>

                <div class="quotidian__header__date">
                  <span> {(new Date(quotidian.date)).toLocaleDateString()} </span>
                </div>
              </header>

              <div class="quotidian__content">
                {quotidian.quote.name}
              </div>

              <div class="quotidian__footer">
                <div class="quotidian__footer__author">
                  <div class="quotidian__footer__author-img"></div>
                  <span> {quotidian.quote.author} </span>
                </div>
              </div>
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
