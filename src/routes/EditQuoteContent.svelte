<script>
  import AddComment       from '../components/AddComment.svelte';
  import AddQuoteContent  from '../components/AddQuoteContent.svelte';
  import AddTags          from '../components/AddTags.svelte';
  import { showHeader, hideHeaderAsync } from '../components/Header.svelte';
  import RectButton       from '../components/RectButton.svelte';
  import { show }         from '../components/Snackbar.svelte';
  import Spinner          from '../components/Spinner.svelte';
  import TextLink         from '../components/TextLink.svelte';

    import {
    client,
    QUOTE_OWN_PROPS,
    UPDATE_QUOTE_CONTENT,
  } from '../data';

  import { handle }       from '../errors';
  import { scrollToTop, status } from '../utils';
  import { LANG_ITEMS } from '../settings';

  /** Qutoe's id */
  export let id = '';

  let date = '';
  let defaultLabel = '';
  let lang = '';
  let name = '';
  let step = 0;
  let topics = [];

  let pageStatus = status.loading;
  const stepsName = ['Content', 'Tags'];
  let initialIndex = 0; // initial lang index

  main();

  function main() {
    if (!id) {
      show({
        message: `Empty id provided. Cannot edit an unexistant quote.`,
        type: 'error',
      });
    }

    hideHeaderAsync();
    fetchQuote();
  }

  async function fetchQuote() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: QUOTE_OWN_PROPS,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      const { quote } = response.data;

      date    = quote.date    ? quote.date    : date;
      name    = quote.name    ? quote.name    : name;
      lang    = quote.lang    ? quote.lang    : lang;
      topics  = quote.topics  ? quote.topics  : topics;

      defaultLabel = lang;
      initialIndex = findLangInitIndex(LANG_ITEMS, lang);

      pageStatus = status.idle;

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }

  function findLangInitIndex(items = [], target) {
    let index = 0;

    items.some((item, i) => {
      if (item.value === target) {
        index = i;
        return true;
      }

      return false;
    });

    return index;
  }

  function onGoBack() {
    showHeader();
    history.back();
  }

  function onSelectStep(index) {
    step = index;
  }

  function onGoToPreviousStep() {
    step--;
    scrollToTop();
  }

  function onGoToNextStep() {
    step++;
    scrollToTop();
  }

  async function onSaveQuote() {
    pageStatus = status.loading;

    try {
      const response = await client.mutate({
        mutation: UPDATE_QUOTE_CONTENT,
        variables: { id, date, lang, name, topics },
      });

      pageStatus = status.completed;

      show({
        text: `The quote has been successfully saved.`,
        type: 'success',
      });

      setTimeout(() => {
        onGoBack();
      }, 2000);

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }
</script>

<style>
  .close-icon {
    position: absolute;
    top: 30px;
    right: 30px;

    cursor: pointer;
    transform-origin: center;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s;
  }

  .close-icon:hover {
    transform: rotate(180deg);
    transform-origin: center;
    transition: .3s;
  }

  .dot-marker {
    position: absolute;
    top: 40%;
    left: 20px;

    display: flex;
    flex-direction: column;
  }

  .dot {
    width: 15px;
    height: 15px;
    margin: 10px 0;

    border-radius: 50%;
    background-color: rgba(255, 255, 255, .7);
    cursor: pointer;

    transition: .3s;
  }

  .dot:hover {
    transform: scale(0.9);
  }

  .dot.selected {
    background-color: #fff;
  }

  .dot-selected-marker {
    width: 25px;
    height: 25px;

    border: 3px solid #fff;
    border-radius: 50%;

    position: absolute;
    top: 2px;
    left: -8px;

    transition: .3s;
  }

  .dot-selected-marker[data-selected="0"] {
    top: 2px;
    left: -8px
  }

  .dot-selected-marker[data-selected="1"] {
    top: 37px;
    left: -8px
  }

  .edit-quote-content {
    width: 100%;
    height: 100%;
    min-height: 700px;

    padding: 40px 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #706fd3;
  }

  .edit-quote__content,
  .edit-quote__topics {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .edit-quote__content {
    padding-top: 100px;
    padding-bottom: 200px;
  }

  .edit-quote__error,
  .edit-quote__success {
    display: flex;
    flex-direction: column;
    align-items: center;

    font-size: 1.2em;
    color: #eee;

    position: relative;
    top: 150px;
  }

  .edit-quote__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 60px 0;
  }

  .edit-quote__topics {
    padding-top: 50px;
    padding-bottom: 100px;
  }

  .row-buttons {
    display: flex;
    margin: 30px 0;
  }

  .subheader {
    color: #fff;
    text-align: center;
    font-weight: bold;
  }

  .txt {
    margin: 40px 0;
    text-align: center;
  }
</style>

<div class="edit-quote-content">
  <div class="close-icon" on:click={onGoBack}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgba(0,0,0,.5)" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
    </svg>
  </div>

  <div class="subheader">Edit quote</div>

  {#if pageStatus === status.loading}
    <div class="edit-quote__loading">
      <Spinner
        color="#fff"
        height="20px"
        width="20px"
        visibility={`${pageStatus === status.loading ? 'visible' : 'hidden'}`} />
      <h3>Loading data...</h3>
    </div>
  {:else if pageStatus === status.completed}
    <div class="edit-quote__success">
      <h3>The quote has been successfully edited.</h3>
    </div>
  {:else if pageStatus === status.idle}
    <div class="skip-and-propose">
      <TextLink text="Save" fontSize="1em" color="rgba(255,255,255, .7)" on:click={onSaveQuote} />
    </div>

    <div class="dot-marker">
      {#each stepsName as stepName, i}
        <div class="tooltip-container right">
          <div
            class="dot"
            class:selected={step === i}
            on:click={() => onSelectStep(i)}>
          </div>

          <div class="tooltip">
            <p>{stepName}</p>
          </div>
        </div>
      {/each}

      <div class="dot-selected-marker" data-selected={step}></div>
    </div>

    {#if step === 0}
      <div class="edit-quote__content">
        <AddQuoteContent
          autofocus
          defaultLabel={defaultLabel}
          bind:quoteName={name}
          bind:lang={lang}
          bind:initialIndex={initialIndex}
          on:enter={onGoToNextStep}
          on:escape={onGoBack}
        />

        <div class="row-buttons">
          <RectButton
            value="Cancel"
            on:click={onGoBack}
            on:enter={onGoToNextStep}
            on:escape={onGoBack}
            on:space={onGoBack}
            secondary={true}
            hint="Or Press Escape" />

          <RectButton
            value="Next"
            on:click={onGoToNextStep}
            on:enter={onGoToNextStep}
            on:escape={onGoBack}
            on:space={onGoToNextStep}
            hint="Or Press Enter" />
        </div>
      </div>
    {:else if step === 1}
      <div class="edit-quote__topics">
        <AddTags
          autofocus
          big={true}
          margin="0 0 100px 0"
          bind:tags={topics}
          on:enter={onSaveQuote}
          on:escape={onGoToPreviousStep}
        />

        <div class="row-buttons">
          <RectButton
            value="Previous"
            on:click={onGoToPreviousStep}
            on:enter={onSaveQuote}
            on:escape={onGoToPreviousStep}
            on:space={onGoToPreviousStep}
            secondary={true}
            hint="Or press Escape" />

          <RectButton
            value="Save"
            on:click={onSaveQuote}
            on:enter={onSaveQuote}
            on:escape={onGoToPreviousStep}
            on:space={onSaveQuote}
            hint="Or Press Enter" />
        </div>
      </div>
    {/if}
  {:else}
    <div class="edit-quote__error">
      <svg xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fill="#fff"
        viewBox="0 0 24 24">
        <path d="M16.142 2l5.858 5.858v8.284l-5.858 5.858h-8.284l-5.858-5.858v-8.284l5.858-5.858h8.284zm.829-2h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-8.482 16.992l3.518-3.568 3.554 3.521 1.431-1.43-3.566-3.523 3.535-3.568-1.431-1.432-3.539 3.583-3.581-3.457-1.418 1.418 3.585 3.473-3.507 3.566 1.419 1.417z"/>
      </svg>

      <p class="txt">
        There was an error fetching & sending data. <br><br>

        There may be a network issue.<br>
        Try refreshing the page or
        <TextLink text="contact the support" color="rgba(0,0,0, .5)" />
        if the problem persists.
      </p>

      <RectButton value="Refresh" on:click={() => main()} margin="60px 0 0 0" />
    </div>
  {/if}
</div>
