<script>
  export let items = [];

  let active = false;
  let activeItem = { label: 'Select your language', value: '' };

  function onClickComponent() {
    active = !active;
  }

  function onClickItem(item) {
    activeItem = item;
  }
</script>

<style>
  .select-component {
    display: block;
    margin: 10px 0 8px 0;
    padding-bottom: 2px;
    position: relative;
    min-width: 180px;
  }

  .select-component *,
  .select-component :after,
  .select-component :before {
    box-sizing: border-box;
  }

  .select-component [type=button] {
    background: #fff;
    border-color: rgba(0, 0, 0, 0.12);
    border-width: 0 0 1px 0;
    color: rgba(0, 0, 0, 0.73);
    cursor: default;
    display: block;
    line-height: 48px;
    padding: 2px 0 1px 16px;
    position: relative;
    text-align: left;
    text-shadow: none;
    width: 100%;
    z-index: 1;
    outline: none;
    overflow: hidden;
  }

  .select-component [type=button]:focus,
  .select-component [type=button]:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .select-component [type=button]:after {
    content: '\25be';
    float: right;
    padding-right: 16px;
  }


  .select-component ul[role=listbox] {
    background-color: white;
    cursor: default;
    list-style: none;
    line-height: 26px;
    overflow: hidden;
    margin: 0;
    max-height: 0;
    position: absolute;
    padding: 0;
    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
    transition: all 0.15s cubic-bezier(0.35, 0, 0.25, 1);
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
  }


  .select-component ul[role=listbox] li {
    height: 48px;
    margin: 0;
    padding: 10px 16px;
    outline: none;
    overflow: hidden;
  }

  .select-component ul[role=listbox] li:focus,
  .select-component ul[role=listbox] li:hover,
  .select-component ul[role=listbox] li.active {
    background: rgba(0, 0, 0, 0.1);
  }

  .select-component.active ul {
    max-height: 200px;
    overflow: auto;
    padding: 8px 0 16px 0px;
    z-index: 2;
    transition: all 0.2s ease;
  }

</style>

<div class="select-component" class:active
  on:click={onClickComponent}>
  <label for="ul-id">
    <button type="button" class="ng-binding">{activeItem.label}</button>
  </label>

  <ul role="listbox"
    class="md-whiteframe-z1"
    aria-activedescendant="{activeItem.value}"
    name="ul-id">

    {#each items as item}
      <li role="option"
        id="{item.value}"
        on:click={() => onClickItem(item)}
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
