<script>
  import { createEventDispatcher } from 'svelte';

  import {
    disableBodyScroll,
    enableBodyScroll,
  } from '../utils';

  export let defaultLabel = 'Select your language';
  export let height       = '';
  export let initialIndex = 0;
  export let items        = [];
  export let margin       = '';
  export let outlined     = false;
  export let round        = false;
  export let width        = '';

  let active              = false;
  let activeIndex         = initialIndex;
  let activeItem          = items.length > 0 ?
    items[initialIndex] :
    { label: defaultLabel, value: '' };

  let domButton;
  let domListBox;

  let heightRule  = height  ? `height: ${height};`  : '';
  let marginRule  = margin  ? `margin: ${margin};`  : '';
  let widthRule   = width   ? `width: ${width};`    : '';
  let style       = `${widthRule} ${heightRule} ${marginRule}`.trim();

  const dispatch = createEventDispatcher();

  let blurTimeout = 0;

  function onBlur(event) {
    active = false;
    activeIndex = initialIndex;
    activeItem = items[activeIndex];

    domListBox.setAttribute('tabindex', '-1');

    domButton.setAttribute('tabindex', '0');
    domButton.focus();

    enableBodyScroll();
  }

  function onClickComponent(event) {
    active = !active;

    if (active) {
      disableBodyScroll();
      domButton.setAttribute('tabindex', '-1');
      domListBox.setAttribute('tabindex', '0');

      setTimeout(() => {
        domListBox.focus();
      }, 250);

    } else { domListBox.blur(); }
  }

  function onClickItem(item, index) {
    activeItem = item;
    activeIndex = index;
    initialIndex = activeIndex;

    dispatch('clickitem', {
      activeItem,
      index,
    });
  }

  function onKeyUp(keyboardEvent) {
    if (!active) {
      return;
    }

    switch (keyboardEvent.keyCode) {
      case 13: // enter
        initialIndex = activeIndex;
        activeItem = items[activeIndex];
        onClickItem(activeItem, activeIndex);
        domListBox.blur();
        break;
      case 27: // escape
        activeIndex = initialIndex;
        activeItem = items[activeIndex];
        domListBox.blur();
        break;
      case 37: // left
        activeIndex = 0;
        activeItem = items[activeIndex];
        break;
      case 38: // up
        activeIndex = (activeIndex - 1) % items.length;
        if (activeIndex < 0) { activeIndex = items.length - 1; }
        activeItem = items[activeIndex];
        break;
      case 39: // right
        activeIndex = items.length - 1;
        activeItem = items[activeIndex];
        break;
      case 40: // down
        activeIndex = (activeIndex + 1) % items.length;
        activeItem = items[activeIndex];
        break;
      default:
        break;
    }
  }
</script>

<style>
  .select-component {
    display: block;
    margin: 10px 0 8px 0;

    padding-bottom: 2px;
    position: relative;
  }

  .select-component *,
  .select-component :after,
  .select-component :before {
    box-sizing: border-box;
  }

  .select-component [type=button] {
    color: rgba(0, 0, 0, 0.73);
    background: #fff;

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    cursor: pointer;

    display: block;
    position: relative;
    top: 0;

    text-shadow: none;
    padding: 20px;

    outline: none;
    overflow: hidden;
    z-index: 1;
    transition: .3s;
  }

  .select-component [type=button]:hover {
    top: 2px;
    filter: brightness(95%);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .select-component [type=button]:focus {
    top: 4px;
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .select-component [type=button].outlined {
    background-color: transparent;
    border: 3px solid #fff;
    color: #fff;
    font-weight: 700;
  }

  .select-component [type=button].outlined:focus {
    border-color: #f56098;
  }

  .select-component [type=button].round {
    border-radius: 50%;
    padding: 0;
  }

  .select-component ul[role=listbox] {
    cursor: pointer;
    background-color: white;

    list-style: none;
    outline: none;

    overflow: hidden;
    margin: 0;
    padding: 0;
    max-height: 0;

    position: absolute;
    z-index: 2;

    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
    transition: all 0.15s cubic-bezier(0.35, 0, 0.25, 1);

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }


  .select-component ul[role=listbox] li {
    margin: 0;
    padding: 25px;
    outline: none;
    overflow: hidden;

    top: 0;
    position: relative;
    transition: .3s;
  }

  .select-component ul[role=listbox] li:focus,
  .select-component ul[role=listbox] li:hover,
  .select-component ul[role=listbox] li.active {
    background: rgba(0, 0, 0, 0.1);
    top: 2px;
  }

  .select-component.active ul {
    max-height: 200px;
    margin-top: -10px;
    overflow: auto;
    z-index: 2;
    transition: all 0.2s ease;
  }
</style>

<div
  class="select-component"
  class:active>
  <label for="ul-id">
    <button
      type="button"
      class="ng-binding"
      class:outlined
      class:round
      bind:this={domButton}
      on:click={onClickComponent}
      style="{style}">

      {activeItem.label}
    </button>
  </label>

  <ul
    role="listbox"
    class="md-whiteframe-z1"
    on:blur={onBlur}
    on:keyup={onKeyUp}
    tabindex="-1"
    bind:this={domListBox}
    aria-activedescendant="{activeItem.value}"
    name="ul-id">

    {#each items as item, i}
      <li role="option"
        id="{item.value}"
        on:click={() => onClickItem(item, i)}
        data-value="{item.value}"
        class="ng-binding ng-scope"
        class:active={activeItem.value === item.value}
        tabindex="-1"
        aria-selected="{activeItem.value === item.value}">

        {item.label}
      </li>
    {/each}
  </ul>
</div>
