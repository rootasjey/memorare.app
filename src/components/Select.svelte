<script>
  import { createEventDispatcher } from 'svelte';

  export let defaultLabel = 'Select your language';
  export let items = [];
  export let outlined = false;
  export let round = false;
  export let width = '';

  let active = false;
  let activeItem = { label: defaultLabel, value: '' };

  let widthRule = width ? `width: ${width};` : '';

  const dispatch = createEventDispatcher();

  function onClickComponent() {
    active = !active;
  }

  function _onClickItem(item) {
    activeItem = item;

    dispatch('clickitem', {
      activeItem,
    });
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

    text-align: left;
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
  }

  .select-component [type=button].round {
    border-radius: 50%;
  }

  .select-component ul[role=listbox] {
    cursor: pointer;
    background-color: white;

    list-style: none;

    overflow: hidden;
    margin: 0;
    padding: 0;
    max-height: 0;

    position: absolute;

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
    overflow: auto;
    z-index: 2;
    transition: all 0.2s ease;
  }
</style>

<div class="select-component" class:active
  on:click={onClickComponent}>
  <label for="ul-id">
    <button
      type="button"
      class="ng-binding"
      class:outlined
      class:round
      style="{widthRule}">

      {activeItem.label}
    </button>
  </label>

  <ul
    role="listbox"
    class="md-whiteframe-z1"
    style="{widthRule}"
    aria-activedescendant="{activeItem.value}"
    name="ul-id">

    {#each items as item}
      <li role="option"
        id="{item.value}"
        on:click={() => _onClickItem(item)}
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
