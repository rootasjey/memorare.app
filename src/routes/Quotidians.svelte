<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Button     from '../components/Button.svelte';
  import IconButton from '../components/IconButton.svelte';
  import Input      from '../components/Input.svelte';
  import Spinner    from '../components/Spinner.svelte';
  import TextLink   from '../components/TextLink.svelte';

  import {
    client,
    DELETE_QUOTIDIAN,
    QUOTIDIANS,
    UPDATE_QUOTIDIAN,
  } from '../data';

  import { handle } from '../errors';

  let domListQuotidians;
  let hasMoreData = true;
  let limit       = 5;
  let queryStatus = 'loading'; // loading || completed || error
  let quotidians  = [];
  let skip        = 0;

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
        const queryQuotidians2 = query(client, {
          query: QUOTIDIANS,
          variables: { limit, skip },
        });

        const resp = await queryQuotidians2.refetch({ limit, skip: 2 });

        quotidians = resp.data.quotidians.entries;

        const { pagination } = resp.data.quotidians;
        limit = pagination.limit;
        skip = pagination.nextSkip;

        queryStatus = 'completed';
      }, 100);

    } catch (error) {
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

    } catch (error) {
      handle(error);
    }
  }

  async function onValidateNewDate(id, index) {
    const dateInput = domListQuotidians.querySelector(`.quotidian[data-index="${index}"] .date-input`);

    if (!dateInput) { return; }

    const targetDate = dateInput.value;

    try {
      const response = await mutate(client, {
        mutation: UPDATE_QUOTIDIAN,
        variables: { id, targetDate },
      });

      const { updateQuotidian } = response.data;

    } catch (error) {
      handle(error);
    }
  }

  async function onResetDate(quotidian, index) {
    const dateInput = domListQuotidians.querySelector(`.quotidian[data-index="${index}"] .date-input`);

    if (!dateInput) { return; }

    dateInput.value = quotidian.date;
  }

  async function onLoadMore() {
    try {
      const response = await queryQuotidians.fetchMore({
        variables: { limit, skip },
        updateQuery: (prev, result) => {
          const { fetchMoreResult: { quotidians: { entries, pagination } } } = result;

          hasMoreData = pagination.hasNext;
          limit = pagination.limit;
          skip = pagination.nextSkip;

          const concatened = [...prev.quotidians.entries, ...entries];

          quotidians = concatened;
        }
      });

    } catch (error) {
      handle(error);
    }
  }
</script>

<style>
  .accent-color-button {
    background: white;
    padding: 15px;
    margin: auto;
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    display: flex;
    align-items: center;

    text-transform: uppercase;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .accent-color-button:hover {
    color: white;
    background: #706fd3;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    transform: translateY(-5px);
  }

 .content__buttons-container {
    margin-top: 20px;
    align-self: flex-end;
  }

  .header__subtext {
    font-size: 1.2em;
    font-weight: 100;

    margin-top: -10px;
  }

  input {
    height: 50px;
    border: 1px solid #706fd3;
    background-color: #eee;

    margin: 0;
    margin-right: 10px;
  }

  .quotidian__date__actions svg {
    position: relative;
    top: 10px;
  }

  .quotidians-page__header {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 50px;
  }

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 5px;
  }

  .list-quotidians {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 80px;
  }

  .quotidian {
    margin: 10px;
    padding: 10px;
    max-width: 400px;

    display: flex;
    flex-direction: column;
  }

  .quotidian__date {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .quotidian__date__actions {
    display: flex;
    flex-direction: row;
  }

  .quotidian__date {
    display: flex;
    flex-direction: row;
    align-items: center;
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

  .quotidian__footer {
    align-self: flex-end;
    margin-top: 5px;
  }

</style>

<div class="quotidians-page">
  <header class="quotidians-page__header">
    <h1>Quotidians</h1>
    <span class="header__subtext">The next daily quotes.</span>
  </header>

  <div class="quotidians-page__content">
    {#await $queryQuotidians}
      <div>
        <Spinner visibility={spinnerVisibility} />
        <span>Loading published quotes...</span>
      </div>
    {:then quotidiansResult}
      <div class="content__buttons-container">
        <IconButton onClick={() => onRefresh()} backgroundColor="#8395a7">
          <span class="icon-button__icon">&#8634;</span>
        </IconButton>
      </div>

      <div class="list-quotidians" bind:this={domListQuotidians}>
        {#each quotidians as quotidian, index}
          <div class="quotidian" transition:fly={{ y: 10, duration: 500 }} data-index="{index}" >
            <div class="quotidian__date">
              <input type="text" value="{quotidian.date}" class="date-input" >

              <div class="quotidian__date__actions">
                <IconButton margin="5px" onClick={ () => onValidateNewDate(quotidian._id, index) } >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                  </svg>
                </IconButton>

                <IconButton margin="5px" onClick={ () => onResetDate(quotidian, index) } >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                  </svg>
                </IconButton>
              </div>
            </div>

            <div class="quotidian__content">
              {quotidian.quote.name}
            </div>

            <div class="quotidian__footer">
              <div class="accent-color-button" on:click={ () => onDelete(quotidian._id) }>
                <span>Delete</span>
              </div>
            </div>
          </div>
        {:else}
          <div>There's currently no quotidians.</div>
        {/each}

        {#if hasMoreData}
          <TextLink text="Load more..." onClick={onLoadMore} />
        {/if}
      </div>
    {:catch error}
      <div>There was an error when retreiving quotidians.</div>
    {/await}
  </div>
</div>
