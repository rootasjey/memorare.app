<script>
  import {
    createEventDispatcher,
    onMount,
  } from 'svelte';

  import { scrollToTop }  from '../utils';

  export let autofocus    = false;
  export let big          = false;
  export let inputValue   = '';
  export let placeholder  = 'Add a comment...';

  let domInput;
  let show = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (autofocus && domInput) {
      domInput.focus();
    }
  });

  function onClearInput() {
    inputValue = '';
    show = false;

    domInput.style.height = '150px';
    domInput.focus();
    scrollToTop();
  }

  function onKeyUp(keyboardEvent) {
    show = inputValue.length > 0 ? true : false;

    const { keyCode } = keyboardEvent;

    if (keyCode === 13 && !keyboardEvent.shiftKey) {
      inputValue = inputValue.trim();
      dispatch('enter', { event: keyboardEvent });
      return;
    }

    if (keyCode === 27) {
      dispatch('escape', { event: keyboardEvent });
    }
  }
</script>

<style>
  .add-comment {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .text-input {
    border: 0;
    margin-bottom: 50px;

    color: #fff;
    background-color: transparent;
    text-align: center;
    resize: none;

    transition: .3s;
  }

  .text-input:hover {
    transition: .3s;
  }

  .text-input::placeholder {
    color: #eee;
  }

  .text-input.big {
    font-size: 3em;
    font-weight: 700;
    max-width: 500px;
  }

  @media screen and (max-width: 550px) {
    .text-input.big {
      font-size: 2em;
    }

    .clear-input-icon {
      margin: 10px;

      position: absolute;
      top: 10px;
    }
  }

  @media screen and (max-width: 470px) {
    .text-input.big {
      max-width: 300px;
    }
  }

  @media screen and (max-width: 380px) {
    .clear-input-icon {
      top: 0;
    }

    .text-input.big {
      font-size: 1.5em;
      max-width: 200px;
    }
  }
</style>

<div class="add-comment">
  <div class="input-container">
    <textarea
      type="text"
      bind:this={domInput}
      class="text-input"
      class:big
      bind:value={inputValue}
      placeholder="{placeholder}"
      oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'
      on:keyup={onKeyUp} />

    <div class="clear-input-icon" class:show on:click={onClearInput}>
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
</div>
