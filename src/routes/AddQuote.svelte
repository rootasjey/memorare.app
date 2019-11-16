<script>
  import { fly }          from 'svelte/transition';
  import { navigate }     from 'svelte-routing';

  import AddAuthor        from '../components/AddAuthor.svelte';
  import AddComment       from '../components/AddComment.svelte';
  import AddQuoteContent  from '../components/AddQuoteContent.svelte';
  import AddReference     from '../components/AddReference.svelte';
  import FlatInputIcon    from '../components/FlatInputIcon.svelte';
  import Select           from '../components/Select.svelte';
  import Spinner          from '../components/Spinner.svelte';
  import Tags             from '../components/Tags.svelte';
  import TextLink         from '../components/TextLink.svelte';

  import { hideHeaderAsync, showHeader } from '../components/Header.svelte';

  import RectButton  from '../components/RectButton.svelte';

  import {
    client,
    CREATE_TEMP_QUOTE,
    TEMP_QUOTE_ADMIN,
    UPDATE_TEMP_QUOTE_ADMIN,
  } from '../data';

  import { primaryAlt } from '../colors';
  import { handle } from '../errors';
  import { canI, settings } from '../settings';
  import { scrollToTop, status } from '../utils';

  /* Quote'id which must be edited. */
  export let id = '';

  let step = 0;

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  const stepsName = ['Content', 'Author', 'Reference', 'Tags', 'Comment'];

  let authorImgUrl  = '';
  let authorJob     = '';
  let authorName    = '';
  let authorSummary = '';
  let authorUrl     = '';
  let authorWikiUrl = '';
  let comment       = '';
  let lang          = settings.getValue('lang');
  let quoteName     = '';
  let refImgUrl     = '';
  let refLang       = lang;
  let refName       = '';
  let refPromoUrl   = '';
  let refType       = '';
  let refSubType    = '';
  let refSummary    = '';
  let refUrl        = '';
  let topics        = [];

  let autofocus = true;
  let canIManageQuote = false;
  let defaultLabel = lang ? lang.toUpperCase() : '';
  let pageStatus = status.idle;

  let sendButtonContent = id ? 'Save' : 'Propose';
  let sendingMsg = id ? 'Saving your changes...' : 'Sending your new quote...';

  main();

  function main() {
    const canIAddQuote = canI('addQuote');
    canIManageQuote = canI('manageQuote');

    if (!canIAddQuote) {
      showHeader();

      setTimeout(() => {
        navigate('/shallnotpass');
      }, 500);

      return;
    }

    hideHeaderAsync();

    setTimeout(() => {
      scrollToTop();
    }, 500);

    fetchTempQuoteIfId();
  }

  async function fetchTempQuoteIfId() {
    if (!id) {
      pageStatus = status.idle;
      return;
    }

    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: TEMP_QUOTE_ADMIN,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      const { tempQuoteAdmin: quote } = response.data;

      const { author: tqAuthor } = quote;

      if (tqAuthor) {
        authorImgUrl  = tqAuthor.imgUrl ? tqAuthor.imgUrl : authorImgUrl;
        authorJob     = tqAuthor.job ? tqAuthor.job : authorJob;
        authorName    = tqAuthor.name ? tqAuthor.name : authorName;
        authorSummary = tqAuthor.summary ? tqAuthor.summary : authorSummary;
        authorUrl     = tqAuthor.url ? tqAuthor.url : authorUrl;
        authorWikiUrl = tqAuthor.wikiUrl ? tqAuthor.wikiUrl : authorWikiUrl;
      }

      comment       = quote.comment     ? quote.comment     : comment;
      lang          = quote.lang        ? quote.lang        : lang;
      quoteName     = quote.name        ? quote.name        : quoteName;
      refImgUrl     = quote.refImgUrl   ? quote.refImgUrl   : refImgUrl;
      refLang       = quote.refLang     ? quote.refLang     : refLang;
      refName       = quote.refName     ? quote.refName     : refName;
      refPromoUrl   = quote.refPromoUrl ? quote.refPromoUrl : refPromoUrl;
      refUrl        = quote.refUrl      ? quote.refUrl      : refUrl;

      topics        = quote.topics.length > 0 ? quote.topics : topics;

      pageStatus = status.idle;

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }

  function onAddAnotherQuote() {
    pageStatus = status.idle;
    quoteName = '';
  }

  function onGoBack() {
    showHeader();
    history.back();
  }

  function onGoToTempQuotes() {
    showHeader();
    navigate('/admin/tempquotes'); // TODO: conditional admin
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

  async function onProposeQuote() {
    const fieldsVariables = {
      authorImgUrl,
      authorJob,
      authorName,
      authorSummary,
      authorUrl,
      authorWikiUrl,
      comment,
      lang,
      name: quoteName,
      refImgUrl,
      refLang,
      refName,
      refPromoUrl,
      refType,
      refSubType,
      refSummary,
      refUrl,
      topics,
    };

    pageStatus = status.loading;

    try {

      const variables = id && id.length > 0 ?
        { ...fieldsVariables, ...{ id } } :
        fieldsVariables;

      const response = await client.mutate({
        mutation: id && id.length > 0 ? UPDATE_TEMP_QUOTE_ADMIN : CREATE_TEMP_QUOTE,
        variables,
      });

      pageStatus = status.completed;
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      handle(error);
      pageStatus = status.error;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
</script>

<style>
  .add-quote {
    width: 100%;
    height: 100%;
    min-height: 700px;

    padding: 40px 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #706fd3;
  }

  .add-quote__author,
  .add-quote__content,
  .add-quote-reference,
  .add-quote__topics,
  .add-quote__comment  {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .add-quote__content {
    padding-bottom: 200px;
  }

  .add-quote__comment {
    padding-top: 50px;
    padding-bottom: 200px;
  }

  .add-quote__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 60px 0;
  }

  .quote-add__error,
  .add-quote__success {
    display: flex;
    flex-direction: column;
    align-items: center;

    font-size: 1.2em;
    color: #eee;

    position: relative;
    top: 150px;
  }

  .add-quote__topics {
    padding-top: 50px;
    padding-bottom: 100px;
  }

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

  .dot-selected-marker[data-selected="2"] {
    top: 72px;
    left: -8px
  }

  .dot-selected-marker[data-selected="3"] {
    top: 107px;
    left: -8px
  }

  .dot-selected-marker[data-selected="4"] {
    top: 142px;
    left: -8px
  }

  .row-buttons {
    display: flex;
    margin: 30px 0;
  }

  .skip-and-propose {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 80px;
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

<div class="add-quote">
  <div class="close-icon" on:click={onGoBack}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgba(0,0,0,.5)" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
    </svg>
  </div>

  <div class="subheader">Add a quote</div>

  {#if pageStatus === status.loading}
    <div class="add-quote__loading">
      <Spinner
        color="#fff"
        height="20px"
        width="20px"
        visibility={`${pageStatus === status.loading ? 'visible' : 'hidden'}`} />
      <h3>{sendingMsg}</h3>
    </div>
  {:else if pageStatus === status.completed}
    <div class="add-quote__success">
      <svg xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fill="#fff"
        viewBox="0 0 24 24">
        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
      </svg>

      <p class="txt">
        Your quote has been successfully proposed! <br>
        Wait for the moderators to review it. <br><br>
        Would you like to
        <TextLink text="add another quote" on:click={onAddAnotherQuote} color="rgba(0,0,0,0.6)" />
        or go to
        <TextLink text="temporary quotes" on:click={onGoToTempQuotes} color="rgba(0,0,0,0.6)" /> ?
      </p>
    </div>
  {:else if pageStatus === status.error}
    <div class="quote-add__error">
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

  {:else}
    <div class="skip-and-propose">
      <TextLink text="{sendButtonContent}" fontSize="1em" color="rgba(255,255,255, .7)" on:click={onProposeQuote} />
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
      <div class="add-quote__content">
        <AddQuoteContent
          autofocus
          defaultLabel={defaultLabel}
          bind:quoteName={quoteName}
          bind:lang={lang}
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
    {/if}

    {#if step === 1}
      <div class="add-quote__author">
        <AddAuthor
          autofocus
          bind:authorImgUrl={authorImgUrl}
          bind:authorName={authorName}
          bind:authorJob={authorJob}
          bind:authorSummary={authorSummary}
          bind:authorUrl={authorUrl}
          bind:authorWikiUrl={authorWikiUrl}
          on:enter={onGoToNextStep}
          on:escape={onGoToPreviousStep}
        />

        <div class="row-buttons">
          <RectButton
            value="Previous"
            on:click={onGoToPreviousStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToPreviousStep}
            secondary={true}
            hint="Or press Escape" />

          <RectButton
            value="Next"
            on:click={onGoToNextStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToNextStep}
            hint="Or Press Enter" />
        </div>
      </div>
    {/if}

    {#if step === 2}
      <div class="add-quote-reference">
        <AddReference
          autofocus
          defaultLabel={defaultLabel}
          bind:refImgUrl={refImgUrl}
          bind:refName={refName}
          bind:refPromoUrl={refPromoUrl}
          bind:refUrl={refUrl}
          on:enter={onGoToNextStep}
          on:escape={onGoToPreviousStep}
        />

        <div class="row-buttons">
          <RectButton
            value="Previous"
            on:click={onGoToPreviousStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToPreviousStep}
            secondary={true}
            hint="Or press Escape" />

          <RectButton
            value="Next"
            on:click={onGoToNextStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToNextStep}
            hint="Or Press Enter" />
        </div>
      </div>
    {/if}

    {#if step === 3}
      <div class="add-quote__topics">
        <Tags
          autofocus
          big={true}
          margin="0 0 100px 0"
          bind:tags={topics}
          on:enter={onGoToNextStep}
          on:escape={onGoToPreviousStep}
        />

        <div class="row-buttons">
          <RectButton
            value="Previous"
            on:click={onGoToPreviousStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToPreviousStep}
            secondary={true}
            hint="Or press Escape" />

          <RectButton
            value="Next"
            on:click={onGoToNextStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToNextStep}
            hint="Or Press Enter" />
        </div>
      </div>
    {/if}

    {#if step === 4}
      <div class="add-quote__comment">
        <AddComment
          autofocus
          big={true}
          bind:inputValue={comment}
          on:enter={onProposeQuote}
          on:escape={onGoToPreviousStep}
        />

        <div class="row-buttons">
          <RectButton
            value="Previous"
            on:click={onGoToPreviousStep}
            on:enter={onGoToNextStep}
            on:escape={onGoToPreviousStep}
            on:space={onGoToPreviousStep}
            secondary={true}
            hint="Or press Escape" />

          <RectButton
            value="{sendButtonContent}"
            on:click={onProposeQuote}
            on:enter={onProposeQuote}
            on:escape={onGoToPreviousStep}
            on:space={onProposeQuote}
            hint="Or Press Enter" />
        </div>
      </div>
    {/if}
  {/if}
</div>
