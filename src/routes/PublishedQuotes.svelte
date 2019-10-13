<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Button     from '../components/Button.svelte';
  import IconButton from '../components/IconButton.svelte';
  import Spinner    from '../components/Spinner.svelte';

  import {
    client,
    CREATE_QUOTIDIAN,
    PUBLISHED_QUOTES_ADMIN,
  } from '../data';

  import { handle } from '../errors';

  let limit       = 10;
  let queryStatus = 'loading'; // loading || completed || error
  let skip        = 0;
  let publishedQuotes  = [];

  $: spinnerVisibility = queryStatus === 'loading' ? 'visible' : 'hidden';

  const queryPublishedQuotes = query(client, {
    query: PUBLISHED_QUOTES_ADMIN,
    variables: { limit, skip },
  });

  (async function fetchPublishedQuotes() {
    try {
      queryStatus = 'loading';

      const response = await queryPublishedQuotes.result();
      publishedQuotes = response.data.publishedQuotesAdmin.entries;

      const { pagination } = response.data.publishedQuotesAdmin;
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
        const queryPublishedQuotes2 = query(client, {
          query: PUBLISHED_QUOTES_ADMIN,
          variables: { limit, skip },
        });

        const resp = await queryPublishedQuotes2.refetch({ limit, skip: 2 });

        publishedQuotes = resp.data.publishedQuotesAdmin.entries;

        const { pagination } = resp.data.publishedQuotesAdmin;
        limit = pagination.limit;
        skip = pagination.nextSkip;

        queryStatus = 'completed';
      }, 100);

    } catch (error) {
      queryStatus = 'error';
      handle(error);
    }
  }

  async function onDelete() {
    console.log('delete published quote');
  }

  async function onCreateQuotidian(quote) {
    try {
      const response = await mutate(client, {
        mutation: CREATE_QUOTIDIAN,
        variables: { lang: quote.lang, quoteId: quote._id },
      });

    } catch (error) {
      handle(error);
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
  }

 .content__buttons-container {
    margin-top: 20px;
    align-self: flex-end;
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

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 5px;
  }

  .list-published-quotes {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .published-quote {
    margin: 20px 0;
    max-width: 500px;
  }

  .published-quotes-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .published-quote__content {
    border: 1px solid rgba(0,0,0,0.5);
    border-radius: 5px;

    padding: 15px;
    margin: 5px 0;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    transition: .3s;
  }

  .published-quote__content:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: .3s;
  }

  .published-quote__footer {
    display: flex;
    justify-content: flex-end;
  }

  .published-quote__footer svg {
    position: relative;
    top: 10px;
  }

</style>

<div class="published-quotes-container">
  <header class="header">
    <h1>Published Quotes</h1>
    <span class="header__subtext">Quotes discoverable by everyone.</span>
  </header>

  <div class="content">
    {#if queryStatus === 'loading'}
      <div>
        <Spinner visibility={spinnerVisibility} />
        <span>Loading published quotes...</span>
      </div>
    {:else if queryStatus === 'completed'}
      <div class="content__buttons-container">
        <IconButton onClick={() => onRefresh()} backgroundColor="#8395a7">
          <span class="icon-button__icon">&#8634;</span>
        </IconButton>
      </div>

      <div class="list-published-quotes">
        {#each publishedQuotes as quote, index}
          <div class="published-quote" transition:fly={{ y: 10, duration: 200 * index }} >
            <div class="published-quote__content">
              {quote.name}
            </div>

            <div class="published-quote__footer">
              <IconButton margin="5px" onClick={ () => onCreateQuotidian(quote) } >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M24 2v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2zm1 11.729l.855-.791c1 .484 1.635.852 2.76 1.654 2.113-2.399 3.511-3.616 6.106-5.231l.279.64c-2.141 1.869-3.709 3.949-5.967 7.999-1.393-1.64-2.322-2.686-4.033-4.271z"/>
                </svg>
              </IconButton>

              <!-- <IconButton margin="5px" >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/>
                </svg>
              </IconButton> -->

              <IconButton margin="5px" onClick={() => onDelete(quote) } backgroundColor="#ff6b6b" >
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="white" fill-rule="evenodd" clip-rule="evenodd">
                  <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z"/>
                </svg>
              </IconButton>
              </div>
          </div>
        {:else}
          <div>There's currently no published quotes.</div>
        {/each}
      </div>
    {:else}
      <div>Tere was an error when retrieving published quotes.</div>
    {/if}
  </div>
</div>
