<script>
  import { onMount }      from 'svelte';

  import Dialog           from '../components/Dialog.svelte';
  import FlatInputIcon    from '../components/FlatInputIcon.svelte';
  import RectButton       from '../components/RectButton.svelte';
  import Select           from '../components/Select.svelte';

  import { primaryAlt }   from '../colors';
  import { canI }         from '../settings';

  export let defaultLabel = '';

  export let autofocus    = false;
  export let refImgUrl    = '';
  export let refLang      = '';
  export let refName      = '';
  export let refUrl       = '';
  export let refPromoUrl  = '';

  let canIManageQuote = false;
  let domRefTitle;
  let isRefImgDialogActive = false;
  let refInitialImgUrl = '';

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  onMount(() => {
    if (autofocus && domRefTitle) {
      domRefTitle.focus();
    }

    main();
  });

  function main() {
    canIManageQuote = canI('manageQuote');
  }

  function onOpenRefImgDialog() {
    isRefImgDialogActive = true;
    refInitialImgUrl = refImgUrl;
  }

  function onCancelEditRefImg() {
    isRefImgDialogActive = false;
    refImgUrl = refInitialImgUrl;
  }

  function onSaveRefImg() {
    isRefImgDialogActive = false;
    refInitialImgUrl = refImgUrl;
  }

  function onSelectRefLang(event) {
    const { activeItem } = event.detail;
    const { value } = activeItem;
    refLang = value;
  }
</script>

<style>
  .add-reference {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dialog-title {
    color: #fff;
    text-align: center;
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

  .ref-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 30px 0;
  }

  .ref-square {
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

  .ref-square {
    height: 180px;
  }

  .ref-square:hover {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .ref-square:active {
    filter: brightness(80%);
    transform: translateY(2px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .ref-square__color-bg {
    width: 100%;
    height: 100%;

    opacity: .5;
    background-color: #706fd3;

    position: absolute;
    top: 0;
    left: 0;

    z-index: 2;
  }

  .ref-square__img {
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

  .ref-square__add {
    font-size: 3em;
    font-weight: 600;

    opacity: .6;
    transition: .3s;
  }

  .ref-square:hover .ref-square__add {
    opacity: 1;
    transition: .3s;
  }

  .row-buttons {
    display: flex;
    margin: 30px 0;
  }
</style>

<div class="add-reference">
  <div class="ref-square" on:click={onOpenRefImgDialog}>
    <div class="ref-square__color-bg"></div>
    <div class="ref-square__img"
      style="{`background-image: url('${refImgUrl}');`}">
    </div>
    <div class="ref-square__add">+</div>
  </div>

  <div class="ref-metadata">
    <input bind:this={domRefTitle} type="text" class="big" bind:value="{refName}" placeholder="Spider-Man (2002 film)...">

    <div class="input-list">
      <FlatInputIcon
        bind:value="{refUrl}"
        placeholder="Add an URL...">

        <div slot="icon">
          {#if refUrl}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
          {/if}
        </div>
      </FlatInputIcon>

      {#if canIManageQuote}
        <FlatInputIcon
          bind:value="{refPromoUrl}"
          placeholder="Add an affiliated URL...">

          <div slot="icon">
            {#if refPromoUrl}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
            {/if}
          </div>
        </FlatInputIcon>
      {/if}
    </div>

    <div>
      <Select
          defaultLabel={defaultLabel}
          items={selectItems}
          outlined={true}
          on:clickitem={onSelectRefLang} />
    </div>
  </div>

  <Dialog bind:active={isRefImgDialogActive} bg="{primaryAlt}" on:enter={onSaveRefImg}>
    <div slot="content" class="dialog-content">
      <div class="dialog-title">
        <h3>Paste reference's image's URL</h3>
      </div>

      <div class="dialog-content__body">
        <FlatInputIcon bind:value={refImgUrl} placeholder="https://myawesomeurl.com...">
          <div slot="icon">
            {#if refImgUrl}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
            {/if}
          </div>
        </FlatInputIcon>
      </div>

      <div class="row-buttons">
        <RectButton value="Cancel" on:click={onCancelEditRefImg} secondary={true} />
        <RectButton value="Save" on:click={onSaveRefImg} />
      </div>
    </div>
  </Dialog>
</div>
