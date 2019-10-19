<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Button     from '../components/Button.svelte';
  import IconButton from '../components/IconButton.svelte';
  import { show }   from '../components/Snackbar.svelte';
  import Spinner    from '../components/Spinner.svelte';

  import {
    client,
    DELETE_TEMP_QUOTE_ADMIN,
    SET_VALIDATION_STATUS_ADMIN,
    TEMP_QUOTES_ADMIN,
    VALIDATE_TEMP_QUOTE_ADMIN,
  } from '../data';

  import { handle } from '../errors';

  let limit           = 10;
  let queryStatus     = 'loading'; // loading || completed || error
  let selectedQuoteId = -1;
  let skip            = 0;
  let tempQuotes      = [];

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryTempQuotes = query(client, {
    query: TEMP_QUOTES_ADMIN,
    variables: { limit, skip },
  });

  (async function fetchTempQuotes() {
    try {
      queryStatus = 'loading';

      const response = await queryTempQuotes.result();
      tempQuotes = response.data.tempQuotesAdmin.entries;

      const { pagination } = response.data.tempQuotesAdmin;
      limit = pagination.limit;
      skip = pagination.nextSkip;

      queryStatus = 'completed';

    } catch (error) {
      queryStatus = 'error';
      handle(error);
    }
  })();

  async function onSwitchStatus(quote) {
    const { _id: id, validation: { status: currentStatus } } = quote;

    const status = currentStatus === 'ko' ? 'ok' : 'ko';

    try {
      const response = await mutate(client, {
        mutation: SET_VALIDATION_STATUS_ADMIN,
        variables: { id, status },
      });

      const { validation } = response.data.setValidationStatusAdmin;

      quote.validation.status = validation.status;

      tempQuotes = tempQuotes;

    } catch (error) {
      handle(error);
    }
  }

  async function onValidate(quote) {
    const { _id: id, validation: { status: currentStatus } } = quote;

    try {
      const response = await mutate(client, {
        mutation: VALIDATE_TEMP_QUOTE_ADMIN,
        variables: { id },
      });

      tempQuotes = tempQuotes.filter((tempQuote) => tempQuote._id !== id);

      show({
        text: `Temporary quote successfully validated`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
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
          query: TEMP_QUOTES_ADMIN,
          variables: { limit, skip },
        });

        const resp = await queryTempQuotes2.refetch({ limit, skip: 2 });

        tempQuotes = resp.data.tempQuotesAdmin.entries;

        const { pagination } = resp.data.tempQuotesAdmin;
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
    const { _id: id } = quote;

    try {
      const response = await mutate(client, {
        mutation: DELETE_TEMP_QUOTE_ADMIN,
        variables: { id },
      });

      const deleteTempQuote = response.data.deleteTempQuoteAdmin;

      tempQuotes = tempQuotes.filter((tempQuote) => tempQuote._id !== id);

      show({
        text: `Temporary quote successfully validated`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  async function onEditTempQuote(quote) {
    navigate(`/addquote/${quote._id}`);
  }
</script>

<style>
  .temp-quotes-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

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

  .temp-quotes-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .list-temp-quote {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    padding-bottom: 40px;
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

<div class="temp-quotes-page">
  <div class="header">
    <h1>Proposed Quotes</h1>
    <span class="header__subtext">Quotes waiting for approval</span>
  </div>

  <div class="temp-quotes-page__content">
      {#if queryStatus === 'loading'}
        <div>
          <Spinner visibility={spinnerVisibility} />
          <span>Loading temporary quotes...</span>
        </div>
      {:else if queryStatus === 'completed'}
        <div class="content__buttons-container">
          <Button outlined={true} value="refresh" onClick={() => onRefresh()} />
        </div>

        <div class="list-temp-quote">
          {#each tempQuotes as quote, index}
            <div class="quote"
              class:selected={selectedQuoteId === quote._id}
              transition:fly={{ y: 10, duration: 200 * index }} >

              <header class="quote__header">
                <div class="quote__header__icons">
                  <IconButton
                    margin="5px"
                    onClick={() => onDelete(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                    </svg>
                  </IconButton>

                  <IconButton
                    margin="5px"
                    onClick={() => onEditTempQuote(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                    </svg>
                  </IconButton>

                  <IconButton margin="5px"
                    onClick={() => onSwitchStatus(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <span style="font-size: 1.2em; position: relative; top: 7px;">
                      {`${quote.validation.status}`}
                    </span>
                  </IconButton>

                  <IconButton margin="5px"
                    onClick={() => onValidate(quote)}
                    backgroundColor="#f56498"
                    elevation={1} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
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
            <div>There's currently no temporary quotes. You're all clean!</div>
          {/each}
        </div>
      {:else}
        <div>There was an error when retrieving temporary quotes.</div>
      {/if}
  </div>
</div>
