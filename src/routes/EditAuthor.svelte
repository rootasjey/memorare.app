<script>
  import Avatar     from '../components/Avatar.svelte';
  import Button     from '../components/Button.svelte';
  import CapHeader  from '../components/CapHeader.svelte';
  import Dialog     from '../components/Dialog.svelte';
  import {
    hide as hideHeader,
    show as showHeader
  } from '../components/Header.svelte';

  import FlatInputIcon from '../components/FlatInputIcon.svelte';
  import Spinner    from '../components/Spinner.svelte';

  import { client, AUTHOR } from '../data';
  import { handle } from '../errors';
  import { status } from '../utils';

  export let id = '';

  let author = {};
  let focusedInputId = -1;
  let pageStatus = status.error;
  let isImgUrlDialogActive = false;

  let imgUrl  = '';
  let job     = '';
  let name    = '';
  let summary = '';
  let url     = '';
  let wikiUrl = '';

  fetchAuthor();

  async function fetchAuthor() {
    if (!id) { pageStatus = status.error; return; }

    try {
      const response = await client.query({
        query: AUTHOR,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      author = response.data.author;

      imgUrl      = author.imgUrl   ? author.imgUrl   : '';
      job         = author.job      ? author.job      : '';
      name        = author.name     ? author.name     : '';
      summary     = author.summary  ? author.summary  : '';
      wikiUrl     = author.wikiUrl  ? author.wikiUrl  : '';
      url         = author.url      ? author.url      : '';

      pageStatus  = status.completed;
      hideHeader();

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }

  function goBack() {
    showHeader();
    window.history.back();
  }

  function onFocusInput(inputId) {
    focusedInputId = inputId;
  }

  function onBlurInput() {
    focusedInputId = -1;
  }

  function showImgUrlDialog() {
    isImgUrlDialogActive = true;
  }

  function onCancelEditImgUrl() {
    isImgUrlDialogActive = false;
    imgUrl = '';
  }

  function onSaveImgUrl() {
    isImgUrlDialogActive = false;
  }
</script>

<style>
  .avatar {
    height: 150px;
    width: 150px;

    margin: 10px;
    padding: 10px;
    border-radius: 50%;
    border: 10px solid #fff;

    position: relative;
    background-color: transparent;
    cursor: pointer;

    box-shadow: 8px 8px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .avatar:hover {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .avatar:active {
    filter: brightness(80%);
    transform: translateY(2px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .avatar__color-bg {
    width: 100%;
    height: 100%;

    opacity: .5;
    background-color: #706fd3;
    border-radius: 50%;

    position: absolute;
    top: 0;
    left: 0;

    z-index: 2;
  }

  .avatar__img {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    border-radius: 50%;

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

  .avatar__add {
    font-size: 3em;
    font-weight: 600;

    position: absolute;
    top: 30%;
    left: 42%;

    opacity: .6;
    transition: .3s;
  }

  .avatar:hover .avatar__add {
    opacity: 1;
    transition: .3s;
  }

  .author-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 30px 0;
  }

  .button {
    min-width: 80px;
    padding: 15px 20px;

    cursor: pointer;
    border-radius: 2px;

    text-align: center;
    font-weight: 600;

    text-transform: uppercase;
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .button:hover {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .button:active {
    filter: brightness(60%);
    transform: translateY(3px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .button-cancel {
    background-color: #f56498;
  }

  .buttons-control {
    display: flex;
    margin-top: 60px;
  }

  .button--hint {
    margin: 10px;
  }

  .button-save {
    color: #706fd3;
    background-color: #fff;
  }

  .button__hint {
    margin-top: 10px;
    color: rgba(0,0,0,0.5);
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

  .dialog-content__body {
    padding-top: 40px;
  }

  .edit-author {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 20px 0;

    color: #fff;
    background-color: #706fd3;
    padding-bottom: 400px;
  }

  .edit-author__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 40px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input[type="text"] {
    height: 50px;
    padding: 25px;

    border: 0;
    border: 3px solid transparent;
    border-radius: 5px;

    color: #fff;
    background-color: transparent;
    text-align: center;

    transition: .3s;
  }

  input[type="text"]:hover {
    transform: translateY(1px);
    transition: .3s;
  }

  input:focus {
    border: 3px solid rgba(0,0,0,0.5);
    transition: .3s;
  }

  input[type="text"]::placeholder {
    color: #eee;
  }

  input.big[type="text"] {
    font-size: 2em;
    font-weight: 700;
  }

  .input-list {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
  }

  textarea {
    color: #fff;
    background-color: transparent;
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    border: 0;
    border-radius: 5px;

    font-size: 1.2em;
    font-weight: 100;
    text-align: justify;

    padding: 25px;
    resize: vertical;
    transition: .3s;
  }

  textarea:hover {
    filter: brightness(96%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  textarea:focus {
    filter: brightness(92%);
    transform: translateY(3px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

</style>

<div class="edit-author">
  <CapHeader caption="{author.name}" title="Edit Author" />

  <div class="close-icon" on:click={goBack}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgba(0,0,0,.5)" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
    </svg>
  </div>

  {#if pageStatus === status.loading}
    <div class="loading">
      <Spinner visibility={`${pageStatus === status.loading ? 'visible' : 'hidden'}`} />
      <h3>Loading author data...</h3>
    </div>
  {:else if pageStatus === status.completed}
    <div class="edit-author__content">
      <div class="avatar" on:click={showImgUrlDialog}>
        <div class="avatar__color-bg"></div>
        <div class="avatar__img"
          style="{`background-image: url('${imgUrl}');`}">
        </div>
        <div class="avatar__add">+</div>
      </div>

      <div class="author-metadata">
        <input type="text" class="big" value="{name}" placeholder="Add or edit the author's name...">
        <input type="text" value="{job}" placeholder="Add a job...">
        <textarea name="author-summary"
          cols="40" rows="7"
          placeholder="Add a cool summary...">{summary}</textarea>

        <div class="input-list">
          <FlatInputIcon
            bind:value="{wikiUrl}"
            placeholder="Add a Wikipedia URL...">

            <div slot="icon">
              {#if wikiUrl}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
              {/if}
            </div>
          </FlatInputIcon>

          <FlatInputIcon
              bind:value="{url}"
              placeholder="Add a website URL...">

              <div slot="icon">
                {#if url}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
                {/if}
              </div>
            </FlatInputIcon>
        </div>
      </div>

      <div class="buttons-control">
        <div class="button--hint">
          <div class="button button-cancel" on:click={goBack}>Cancel</div>
          <div class="button__hint">Or press Escape</div>
        </div>

        <div class="button--hint">
          <div class="button button-save">Save</div>
          <div class="button__hint">Or press Enter</div>
        </div>
      </div>
    </div>
  {:else}
    <div class="error">
      <h3>There was an error fetching data.</h3>
      <p>Try reloading the page or contact the support if the problem persists.</p>

      <Button value="Refresh" outlined={true} onClick={fetchAuthor} />
    </div>
  {/if}

  <Dialog bind:active={isImgUrlDialogActive} bg="#5352ed">
    <div slot="content" class="dialog-content">
      <CapHeader caption="Edit Author" title="Enter an image's URL"/>

      <div class="dialog-content__body">
        <FlatInputIcon bind:value={imgUrl} placeholder="Add an image's URL...">
          <div slot="icon">
            {#if imgUrl}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
            {/if}
          </div>
        </FlatInputIcon>
      </div>

      <div class="buttons-control">
        <div class="button--hint">
          <div class="button button-cancel" on:click={onCancelEditImgUrl}>Cancel</div>
        </div>

        <div class="button--hint">
          <div class="button button-save" on:click={onSaveImgUrl}>Save</div>
        </div>
      </div>
    </div>
  </Dialog>
</div>
