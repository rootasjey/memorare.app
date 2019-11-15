<script>
  import {
    createEventDispatcher,
    onMount,
  } from 'svelte';

  import Select           from '../components/Select.svelte';
  import { settings }     from '../settings';
  import { scrollToTop }  from '../utils';

  export let autofocus    = false;
  export let defaultLabel = '';
  export let placeholder  = "With great power comes great responsibility...";
  export let quoteName    = '';
  export let lang         = '';

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  let domInput;
  let show = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (autofocus && domInput) {
      domInput.focus();
    }

    if (quoteName) {
      setGhostAreaHeight();
      show = true;
    }
  });


  function setGhostAreaHeight() {
    domInput.style.height = `${400 * Math.floor(quoteName.length / 84)}px`;
  }

  function onClearInput() {
    quoteName = '';
    show = false;

    domInput.style.height = '150px';
    domInput.focus();
    scrollToTop();
  }

  function onKeyUp(keyboardEvent) {
    show = quoteName.length > 0 ? true : false;

    if (keyboardEvent.keyCode === 13 &&
      !keyboardEvent.shiftKey) {

      quoteName = quoteName.trim();

      dispatch('enter', { event: keyboardEvent });
      return;
    }

    if (keyboardEvent.keyCode === 27) {
      dispatch('escape', { event: keyboardEvent });
    }
  }

  function onSelectLang(event) {
    const { activeItem } = event.detail;
    const { value } = activeItem;
    lang = value;
  }

</script>

<style>
  .add-quote {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ghost-area {
    min-height: 250px;
    background-color: transparent;
    border: 0;

    color: #fff;
    font-size: 3em;
    text-align: center;

    margin-bottom: 50px;
    resize: none;
  }

  .ghost-area::placeholder {
    color: #eee;
    opacity: .8;
  }

  .clear-input-icon {
    display: none;
    margin: 10px;

    cursor: pointer;

    position: absolute;
    right: -30px;
    top: 27px;

    transition: .3s;
  }

  .clear-input-icon:hover {
    transform: scale(1.1);
  }

  .show {
    display: block;
  }

  .input-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .select-container {
    align-self: flex-end;

    position: relative;
    top: -30px;
  }

  @media screen and (max-width: 570px) {
    .clear-input-icon {
      top: 5px;
    }

    .ghost-area {
      font-size: 2em;
      min-height: 130px;
    }

    .select-container {
      align-self: auto;
    }
  }

  @media screen and (max-width: 400px) {
    .clear-input-icon {
      top: -5px;
    }

    .ghost-area {
      font-size: 1.5em;
    }
  }
</style>

<div class="add-quote">
  <div class="input-container">
    <textarea
      class="ghost-area"
      placeholder={placeholder}
      oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
      name="quote-content"
      on:keyup={onKeyUp}
      bind:value={quoteName}
      bind:this={domInput}
    />

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

  <div class="select-container">
    <Select
        defaultLabel={defaultLabel}
        items={selectItems}
        outlined={true}
        on:clickitem={onSelectLang} />
  </div>
</div>
