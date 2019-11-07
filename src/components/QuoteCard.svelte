<script>
  import { createEventDispatcher } from 'svelte';
  import { fly }      from 'svelte/transition';
  import IconButton   from '../components/IconButton.svelte';

  // Props
  export let authorImg        = '';
  export let authorName       = '';
  export let backgroundColor  = '';
  export let color            = '';
  export let content          = '';
  export let selected         = false;
  export let tag              = '';

  let authorImgRule = authorImg ? `background-img: ${authorImg};` : '';
  let backgroundColorCSS = backgroundColor ? `background-color: ${backgroundColor}`: '';
  let colorCSS = color ? `color: ${color}`: '';

  let styles = `${backgroundColorCSS}; ${colorCSS}`;

  const dispatch = createEventDispatcher();

  function onClickAuthor(event) {
    dispatch('clickauthor', { event });
  }
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
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    border: 2px solid transparent;
    border-radius: 10px;

    position: relative;
    transition: .3s;
  }

  .quote:hover {
    transform: translateY(2px);
    filter: brightness(95%);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .quote:active,
  .quote.selected {
    transform: translateY(4px);
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
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

  .profile-circle {
    align-items: center;
    display: flex;
    width: 100%;

    white-space: nowrap;
    text-overflow: ellipsis;

    cursor: pointer;
    transition: .3s;
  }

  .profile-circle:hover {
    color: #f56498;
    transition: .3s;
  }

  .profile-circle-img {
    height: 30px;
    width: 30px;

    border-radius: 50%;
    background-color: #353b48;
    background-size: cover;

    margin-right: 10px;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");

    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle-img:hover {
    filter: brightness(98%);
    transform: translateY(1px);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle-img:active {
    filter: brightness(96%);
    transform: translateY(2px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
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

<div class="quote" class:selected on:click style="{styles}">
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
      <div class="profile-circle" on:click={onClickAuthor}>
          <div class="profile-circle-img" style="${authorImgRule}"></div>
          <span> {authorName} </span>
      </div>
    {/if}
  </div>
</div>
