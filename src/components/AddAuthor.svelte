<script>
  import {
    createEventDispatcher,
    onMount,
  } from 'svelte';

  import Dialog           from '../components/Dialog.svelte';
  import FlatInputIcon    from '../components/FlatInputIcon.svelte';
  import Select           from '../components/Select.svelte';
  import RectButton       from '../components/RectButton.svelte';
  import { primaryAlt }   from '../colors';
  import { scrollToTop }  from '../utils';

  export let autofocus      = false;
  export let authorImgUrl   = '';
  export let authorName     = '';
  export let authorJob      = '';
  export let authorSummary  = '';
  export let authorUrl      = '';
  export let authorWikiUrl  = '';

  let authorInitialImgUrl = '';
  let domAuthorName;
  let domAuthorSummary;
  let isAuthorImgDialogActive = false;
  let show = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (autofocus && domAuthorName) {
      domAuthorName.focus();
    }
  });

  function onCancelEditAuthorImg() {
    isAuthorImgDialogActive = false;
    authorImgUrl = authorInitialImgUrl;
  }

  function onClearInput() {
    authorSummary = '';
    show = false;

    domAuthorSummary.style.height = '300px';
    domAuthorSummary.focus();
    scrollToTop();
  }

  function onEnter(keyboardEvent) {
    dispatch('enter', { event: keyboardEvent });
  }

  function onEscape(keyboardEvent) {
    dispatch('escape', { event: keyboardEvent });
  }

  function onKeyUp(keyboardEvent) {
    show = authorSummary.length > 0 ? true : false;

    if (keyboardEvent.keyCode === 13) {
      dispatch('enter', { event: keyboardEvent });
      return;
    }

    if (keyboardEvent.keyCode === 27) {
      dispatch('escape', { event: keyboardEvent });
    }
  }

  function onKeyUpTextArea(keyboardEvent) {
    show = authorSummary.length > 0 ? true : false;

    if (keyboardEvent.keyCode === 13 && !keyboardEvent.shiftKey) {
      authorSummary = authorSummary.trim();
      dispatch('enter', { event: keyboardEvent });
      return;
    }

    if (keyboardEvent.keyCode === 27) {
      dispatch('escape', { event: keyboardEvent });
    }
  }

  function onOpenAuthorImgDialog() {
    isAuthorImgDialogActive = true;
    authorInitialImgUrl = authorImgUrl;
  }

  function onSaveAuthorImg() {
    isAuthorImgDialogActive = false;
    authorInitialImgUrl = authorImgUrl;
  }
</script>

<style>
  .add-author {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .author-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 30px 0;
  }

  .clear-input-icon {
    display: none;
    margin: 10px;

    cursor: pointer;

    position: absolute;
    right: -40px;
    top: 10px;

    transition: .3s;
  }

  .clear-input-icon:hover {
    transform: scale(1.1);
  }

  .dialog-title {
    color: #fff;
    text-align: center;
  }

  .ghost-text-area {
    min-width: 500px;
    min-height: 400px;

    background-color: transparent;
    border: 0;

    color: #fff;
    font-size: 2em;
    text-align: center;
    resize: none;
  }

  .ghost-text-area::placeholder {
    color: #eee;
    opacity: .8;
  }

  input[type="text"] {
    height: 50px;
    border: 0;

    color: #fff;
    background-color: transparent;
    text-align: center;

    transition: .3s;
  }

  input[type="text"]:hover {
    transform: translateY(1px);
    transition: .3s;
  }

  input[type="text"]::placeholder {
    color: #eee;
  }

  input.big[type="text"] {
    font-size: 2em;
    font-weight: 700;
  }

  .input-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .input-list {
    display: flex;
    flex-direction: column;
    align-self: flex-start;

    margin: 20px 0;
  }

  .job-input {
    position: relative;
    top: -30px;
  }

  .profile-circle {
    height: 150px;
    border-radius: 50%;
  }

  .profile-circle {
    width: 150px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 10px;
    padding: 10px;
    border: 10px solid #fff;

    position: relative;
    background-color: transparent;
    cursor: pointer;

    box-shadow: 8px 8px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle:hover {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle:active {
    filter: brightness(80%);
    transform: translateY(2px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle__color-bg {
    border-radius: 50%;
  }

  .profile-circle__color-bg {
    width: 100%;
    height: 100%;

    opacity: .5;
    background-color: #706fd3;

    position: absolute;
    top: 0;
    left: 0;

    z-index: 2;
  }

  .profile-circle__img {
    border-radius: 50%;
  }

  .profile-circle__img {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    z-index: 1;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
  }

  .profile-circle__add {
    font-size: 3em;
    font-weight: 600;

    opacity: .6;
    transition: .3s;
  }

  .profile-circle:hover .profile-circle__add {
    opacity: 1;
    transition: .3s;
  }

  .row-buttons {
    display: flex;
    margin: 30px 0;
  }

  .show {
    display: block;
  }

  @media screen and (max-width: 570px) {
    .ghost-text-area {
      font-size: 1.5em;
      min-height: 150px;
      min-width: 400px;
    }

    .clear-input-icon {
      top: 0;
      right: -30px;
    }
  }

  @media screen and (max-width: 530px) {
    .ghost-text-area {
      min-width: 90%;
      min-height: 250px;
    }

    .input-list {
      align-self: auto;
    }

    .clear-input-icon {
      top: -5px;
      right: -50px;
    }
  }

  @media screen and (max-width: 350px) {
    .clear-input-icon {
      top: -16px;
    }

    .ghost-text-area {
      font-size: 1em;
      min-width: 70%;
      min-height: 150px;
    }
  }
</style>

<div class="add-author">
  <div class="profile-circle" on:click={onOpenAuthorImgDialog}>
    <div class="profile-circle__color-bg"></div>
    <div class="profile-circle__img"
      style="{`background-image: url('${authorImgUrl}');`}">
    </div>
    <div class="profile-circle__add">+</div>
  </div>

  <div class="author-metadata">
    <input
      bind:this={domAuthorName}
      type="text"
      class="big"
      bind:value="{authorName}"
      on:keyup={onKeyUp}
      placeholder="Uncle Ben...">

    <input
      type="text"
      class="job-input"
      on:keyup={onKeyUp}
      bind:value="{authorJob}"
      placeholder="Civilian...">

    <div class="input-container">
      <textarea
        bind:this={domAuthorSummary}
        class="ghost-text-area"
        name="author-summary"
        on:keyup={onKeyUpTextArea}
        oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
        placeholder="Benjamin Franklin Parker, usually called Uncle Ben, is a fictional character appearing in American comic books published by Marvel Comics. He is the husband of May Parker and paternal uncle of Peter Parker (Spider-Man)..."
        bind:value={authorSummary}/>

      <div
        class="clear-input-icon"
        class:show
        on:click={onClearInput}>
        <svg
          width="32"
          height="32"
          fill="rgba(0,0,0,0.5)"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill-rule="evenodd"
          clip-rule="evenodd">
          <path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm.456-11.429l-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z"/>
        </svg>
      </div>
    </div>

    <div class="input-list">
      <FlatInputIcon
        bind:value="{authorWikiUrl}"
        on:enter={onEnter}
        on:escape={onEscape}
        placeholder="Add a Wikipedia URL...">

        <div slot="icon">
          {#if authorWikiUrl}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
          {/if}
        </div>
      </FlatInputIcon>

      <FlatInputIcon
        bind:value="{authorUrl}"
        on:enter={onEnter}
        on:escape={onEscape}
        placeholder="Add a website URL...">

        <div slot="icon">
          {#if authorUrl}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
          {/if}
        </div>
      </FlatInputIcon>
    </div>
  </div>

  <Dialog bind:active={isAuthorImgDialogActive} bg="{primaryAlt}" on:enter={onSaveAuthorImg}>
    <div slot="content" class="dialog-content">
      <div class="dialog-title">
        <h3>Paste author's image URL</h3>
      </div>

      <div class="dialog-content__body">
        <FlatInputIcon bind:value={authorImgUrl} placeholder="https://myawesomeurl.com...">
          <div slot="icon">
            {#if authorImgUrl}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
            {/if}
          </div>
        </FlatInputIcon>
      </div>

      <div class="row-buttons">
        <RectButton value="Cancel" on:click={onCancelEditAuthorImg} secondary={true} />
        <RectButton value="Save" on:click={onSaveAuthorImg} />
      </div>
    </div>
  </Dialog>
</div>
