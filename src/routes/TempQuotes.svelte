<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly } from 'svelte/transition';

  import Button     from '../components/Button.svelte';
  import IconButton from '../components/IconButton.svelte';
  import Spinner    from '../components/Spinner.svelte';

  import {
    client,
    SET_VALIDATION_STATUS,
    TEMP_QUOTES,
    VALIDATE_TEMP_QUOTE,
  } from '../data';

  let limit       = 2;
  let queryStatus = 'loading'; // loading || completed || error
  let skip        = 0;
  let tempQuotes  = [];

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryTempQuotes = query(client, {
    query: TEMP_QUOTES,
    variables: { limit, skip },
  });

  async function fetchTempQuotes() {
    try {
      queryStatus = 'loading';

      const response = await queryTempQuotes.result();
      tempQuotes = response.data.tempQuotes.entries;

      const { pagination } = response.data.tempQuotes;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      queryStatus = 'completed';

    } catch (error) {
      console.error(error);
      queryStatus = 'error';
    }
  }

  fetchTempQuotes();

  async function onSwitchStatus(quote) {
    const { _id: id, validation: { status: currentStatus } } = quote;

    const status = currentStatus === 'ko' ? 'ok' : 'ko';

    try {
      const response = await mutate(client, {
        mutation: SET_VALIDATION_STATUS,
        variables: { id, status },
      });

      const { validation } = response.data.setValidationStatus;

      quote.validation.status = validation.status;

      tempQuotes = tempQuotes;

    } catch (error) {
      console.error(error);
    }
  }

  async function onValidate(quote) {
    const { _id: id, validation: { status: currentStatus } } = quote;

    try {
      const response = await mutate(client, {
        mutation: VALIDATE_TEMP_QUOTE,
        variables: { id },
      });

      tempQuotes = tempQuotes.filter((tempQuote) => tempQuote._id !== id);

    } catch (error) { console.error(error); }
  }

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
        const queryTempQuotes2 = query(client, {
          query: TEMP_QUOTES,
          variables: { limit, skip },
        });

        const resp = await queryTempQuotes2.refetch({ limit, skip: 2 });

        tempQuotes = resp.data.tempQuotes.entries;

        const { pagination } = resp.data.tempQuotes;
        limit = pagination.limit;
        skip = pagination.nextSkip;

        queryStatus = 'completed';
      }, 100);

    } catch (error) {
      console.error(error);
      queryStatus = 'error';
    }

  }

  async function onDelete() {

  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
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

  .proposed-quotes-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .temp-quote {
    margin: 40px 0;
    max-width: 500px;
  }

  .temp-quote__content {
    border: 1px solid rgba(0,0,0,0.5);
    border-radius: 5px;

    padding: 15px;
    margin: 5px 0;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    transition: .3s;
  }

  .temp-quote__content:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: .3s;
  }

  .temp-quote__footer {
    display: flex;
    justify-content: flex-end;
  }

  .content__buttons-container {
    margin-top: 20px;
    align-self: flex-end;
  }

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 5px;
  }

  .temp-quote__footer svg {
    position: relative;
    top: 10px;
    left: 1px;
  }

</style>

<div class="proposed-quotes-container">
  <div class="header">
    <h1>Proposed Quotes</h1>
    <span class="header__subtext">Quotes waiting for approval</span>
  </div>

  <div class="content">
      {#if queryStatus === 'loading'}
        <div>
          <Spinner visibility={spinnerVisibility} />
          <span>Loading temporary quotes...</span>
        </div>
      {:else if queryStatus === 'completed' }
        <div class="content__buttons-container">
          <IconButton onClick={() => onRefresh()} backgroundColor="#f56498">
            <span class="icon-button__icon">&#8634;</span>
          </IconButton>
        </div>

        <div class="list-temp-quote">
          {#each tempQuotes as quote, index}
            <div class="temp-quote" transition:fly="{{ y: 10, duration: 200 * index }}">
              <div class="temp-quote__content">
                {quote.name}
              </div>

              <div class="temp-quote__footer">
                <IconButton margin="5px" onClick={ () => onSwitchStatus(quote) } >
                  <span style="font-size: 1.2em; position: relative; top: 7px;">
                    {`${quote.validation.status}`}
                  </span>
                </IconButton>

                <IconButton margin="5px" onClick={ () => onValidate(quote) }>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                  </svg>
                </IconButton>

                <IconButton margin="5px" onClick={() => onDelete(quote) } >
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z"/>
                  </svg>
                </IconButton>
              </div>
          </div>
          {:else}
            <div>There's currently no temporary quotes. You're all clean!</div>
          {/each}
        </div>
      {:else}
        <div>Hu ho...The fetch query (to retrieve temporary quotes) could not be fulfilled.</div>
      {/if}
  </div>
</div>
