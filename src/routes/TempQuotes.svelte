<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly } from 'svelte/transition';

  import {
    client,
    SET_VALIDATION_STATUS,
    TEMP_QUOTES
  } from '../data';

  import Button from '../components/Button.svelte';

  let limit = 5;
  let skip = 0;
  const tempQuotes = [];
  let listTempQuotes;

  const tempQuotesQuery = query(client, {
    query: TEMP_QUOTES,
    variables: { limit, skip },
  });

  async function onSwitchStatus(quote, domIndex) {
    const { _id: id, validation: { status: currentStatus } } = quote;

    const button = listTempQuotes.querySelector(`.status-button[data-index="${domIndex}"]`);
    if (!button) { return; }

    const status = button.dataset.value === 'ko' ? 'ok' : 'ko';

    try {
      const response = await mutate(client, {
        mutation: SET_VALIDATION_STATUS,
        variables: { id, status },
      });

      const { validation } = response.data.setValidationStatus;

      button.textContent = `status: ${validation.status}`;
      button.dataset.value = validation.status;

    } catch (error) {
      console.error(error);
    }
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
    {#await $tempQuotesQuery}
      <!-- $tempQuotesQuery is pending -->
    {:then result}
      <!-- $tempQuotesQuery was fulfilled -->
      <div class="list-temp-quote" bind:this={listTempQuotes}>
        {#each result.data.tempQuotes.entries as quote, index}
          <div class="temp-quote" transition:fly="{{ y: 10, duration: 200 * index }}">
            <div class="temp-quote__content">
              {quote.name}
            </div>

            <div class="temp-quote__footer">
              <Button value={`Status: ${quote.validation.status}`}
                margin="5px"
                additionalClass="status-button"
                dataIndex={index}
                dataValue={quote.validation.status}
                onClick={() => onSwitchStatus(quote, index) } />

              <Button value="Validate" margin="5px" dataIndex={index}
                additionalClass="validation-button" />
            </div>
          </div>
        {:else}
          <div>There's currently no temporary quotes. You're all clean!</div>
        {/each}
      </div>
    {:catch error}
      <!-- $tempQuotesQuery was rejected -->
      <div>Hu ho...The fetch query (to retrieve temporary quotes) could not be fulfilled.</div>
    {/await}
  </div>
</div>
