<script>
  import { fly }      from 'svelte/transition';
  import IconButton   from '../components/IconButton.svelte';

  // Props
  export let authorName = '';
  export let backgroundColor = '';
  export let color = '';
  export let content = '';
  export let onClick = () => {};
  export let selected = false;
  export let tag = '';

  $: backgroundColorCSS = backgroundColor ? `background-color: ${backgroundColor}`: '';
  $: colorCSS = color ? `color: ${color}`: '';
  $: styles = `${backgroundColorCSS}; ${colorCSS}`;
</script>

<style>
  .quote {
    margin: 10px;
    padding: 30px;

    min-height: 320px;
    width: 240px;

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

    max-height: 250px;
    overflow-y: auto;

    padding-top: 10px;
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

    max-width: 170px;
    max-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    transition: .3s;
  }

  .quote__header__topics:hover {
    background-color: #cc5380;
    transition: .3s;
  }
</style>

<div class="quote" class:selected on:click={onClick} style="{styles}">
  <header class="quote__header">
    <div class="quote__header__icons">
      <slot name="quoteHeaderIcons"></slot>
    </div>

    {#if tag}
      <div class="quote__header__topics">
        <span> {tag} </span>
      </div>
    {/if}
  </header>

  <div class="quote__content">
    {content}
  </div>

  <div class="quote__footer">
    {#if authorName}
      <div class="quote__footer__author">
          <div class="quote__footer__author-img"></div>
          <span> {authorName} </span>
      </div>
    {/if}
  </div>
</div>
