<script>
  import {
    createEventDispatcher,
    onMount,
  } from 'svelte';

  import { fly } from 'svelte/transition';

  export let autofocus    = false;
  export let big          = false;
  export let placeholder  = 'Add a new tag...';
  export let margin       = '';
  export let tags         = [];

  let domInput; // bind this
  let show = false;
  let tagValue = '';

  let marginRule = margin ? `margin: ${margin};` : '';
  let style = `${marginRule}`.trim();

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (autofocus && domInput) {
      domInput.focus();
    }
  });

  function onAddTag(name = '') {
    const computedName = name.replace(/,/ig, '').replace(/;/ig, '');

    if (!computedName || computedName.length < 2) { return; }

    tags = [...tags, computedName]
    tagValue = '';
  }

  function onClearInput() {
    tagValue = '';
    show = false;
    domInput.focus();
  }

  function onEditTag(name = '', event) {
    onRemoveTag(name, event);
    tagValue = name;
  }

  function onKeyUp(keyboardEvent) {
    const { keyCode } = keyboardEvent;

    if (keyCode === 13 && tagValue.length === 0) {
      dispatch('enter', { event: keyboardEvent });
      return;
    }

    if (keyCode === 186 || keyCode === 188 ||
        keyCode === 9 || keyCode === 13) {

        onAddTag(tagValue);
    }

    if (keyCode === 27) {
      dispatch('escape',{ event: keyboardEvent });
    }

    show = tagValue.length > 0 ? true : false;
  }

  // NOTE: Svelte doesn't apply svg:hover rule
  function onMouseOver(event) {
    const svg = event.target.querySelector('svg');
    if (!svg) { return; }
    svg.setAttribute('fill', '#f56098');
  }

  function onMouseOut(event) {
    const svg = event.target.querySelector('svg');
    if (!svg) { return; }
    svg.setAttribute('fill', '#560fd3');
  }

  function onRemoveTag(name = '', event) {
    event.stopPropagation()
    tags = tags.filter(tag => tag !== name);
    domInput.focus();
  }
</script>

<style>
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

  .svg-delete-icon {
    pointer-events: none;
    transition: .3s;
  }

  .svg-delete-icon > path {
    pointer-events: none;
  }

  .text-input {
    border: 0;
    margin-bottom: 50px;

    color: #fff;
    background-color: transparent;
    text-align: center;

    transition: .3s;
  }

  .text-input:hover {
    transform: translateY(1px);
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

  .tags {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    max-width: 70%;
    min-height: 64px;

    margin: 10px 0;
  }

  .tag {
    margin: 10px;
    padding: 10px;

    color: #560fd3;
    background-color: #fff;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .tag:hover {
    transform: translateY(2px);
    filter: brightness(95%);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .tag:active {
    transform: translateY(4px);
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .tag-name {
    font-weight: 700;
    margin-right: 10px;

    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (max-width: 550px) {
    .tag-name {
      max-width: 50%;
    }

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

    .tag {
      max-width: 200px;
    }

    .text-input.big {
      font-size: 1.5em;
      max-width: 200px;
    }
  }
</style>

<div class="tags" style="{style}">
  <div class="input-container">
    <input
      type="text"
      bind:this={domInput}
      class="text-input"
      class:big
      bind:value={tagValue}
      placeholder="{placeholder}"
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

  <div class="tags-list">
    {#each tags as tag}
      <div
        class="tag"
        on:click={(event) => onEditTag(tag, event)}
        in:fly="{{ y: 10, duration: 500 }}">

        <div class="tag-name"> {tag} </div>

        <div
          class="delete-tag-icon"
          on:mouseover={onMouseOver}
          on:mouseout={onMouseOut}
          on:click={(event) => onRemoveTag(tag, event)}>

          <svg
            class="svg-delete-icon"
            fill="#560fd3"
            width="24" height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd">
              <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
            </svg>
        </div>
      </div>
      {:else}
        <h3 style="color: #fff"><em>No tags added yet</em></h3>
    {/each}
  </div>
</div>
