<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly } from 'svelte/transition';

  import Button   from '../components/Button.svelte';
  import Spinner  from '../components/Spinner.svelte';
  import {
    client,
    SET_VALIDATION_STATUS,
    TEMP_QUOTES,
    VALIDATE_TEMP_QUOTE,
  } from '../data';

  let limit       = 5;
  let queryStatus = 'loading';
  let skip        = 0;
  let tempQuotes  = [];

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryTempQuotes = query(client, {
    query: TEMP_QUOTES,
    variables: { limit, skip },
  });

  async function fetchTempQuotes() {
    try {
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

</script>

<style>
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
    margin: 20px 0;
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
         <div class="list-temp-quote">
          {#each tempQuotes as quote, index}
            <div class="temp-quote" transition:fly="{{ y: 10, duration: 200 * index }}">
              <div class="temp-quote__content">
                {quote.name}
              </div>

              <div class="temp-quote__footer">
                <Button value={`Status: ${quote.validation.status}`}
                  margin="5px"
                  onClick={() => onSwitchStatus(quote) } />

                <Button value="Validate" margin="5px"
                  onClick={() => onValidate(quote) } />
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
