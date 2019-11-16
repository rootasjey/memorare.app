<script>
  import { createEventDispatcher } from 'svelte';

  export let alignSelf  = '';
  export let bg         = '';
  export let color      = '';
  export let height     = '';
  export let hide       = false;
  export let hint       = '';
  export let margin     = '';
  export let outlined   = false;
  export let primary    = false;
  export let secondary  = false;
  export let value      = '';
  export let width      = '';

  let alignSelfRule = alignSelf ? `align-self: ${alignSelf};` : '';
  let bgRule        = bg        ? `background: ${bg};`        : '';
  let colorRule     = color     ? `color: ${color};`          : '';
  let marginRule    = margin    ? `margin: ${margin};`        : '';
  let widthRule     = width     ? `width: ${width};`          : '';
  let heightRule    = height    ? `height: ${height};`        : '';

  let style = `
    ${alignSelfRule}
    ${bgRule}
    ${colorRule}
    ${marginRule}
    ${widthRule}
    ${heightRule}
  `.trim();

  const dispatch = createEventDispatcher();

  function onKeyUp(keyboardEvent) {
    switch (keyboardEvent.keyCode) {
      case 13:
        dispatch('enter', { event: keyboardEvent });
        break;
      case 27:
        dispatch('escape', { event: keyboardEvent });
        break;
      case 32:
        dispatch('space', { event: keyboardEvent });
        break;
      default:
        break;
    }
  }
</script>

<style>
  .button {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 15px 20px;

    color: #706fd3;
    background-color: #fff;

    cursor: pointer;
    border-radius: 2px;

    text-align: center;
    font-weight: 600;

    text-transform: uppercase;
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .button:hover,
  .rect-button:focus .button {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .button:active {
    filter: brightness(60%);
    transform: translateY(3px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .button.primary {
    color: #fff;
    background-color: #706fd3;
  }

  .button.secondary {
    color: #fff;
    background-color: #f56498;
  }

  .hide {
    display: none;
  }

  .outlined {
    background-color: transparent;
    border: 3px solid;
  }

  .outlined.primary {
    color: #706fd3;
    background-color: transparent;
    border: 3px solid;
  }

  .outlined.secondary {
    color: #f56498;
    background-color: transparent;
    border: 3px solid;
  }


  .hint {
    margin-top: 10px;
    color: rgba(0,0,0,0.5);
  }

  .rect-button {
    margin: 10px;
    outline: none;
  }

  .afterText {
    margin-left: 10px;
  }

  .beforeText {
    margin-right: 10px;
  }
</style>

<div
  class="rect-button"
  style="{style}"
  tabindex="0"
  on:click
  on:keyup={onKeyUp}>

  <div class="button"
    class:primary
    class:secondary
    class:outlined
    class:hide>

    <div class="beforeText">
      <slot name="beforeText"></slot>
    </div>

    {value}

    <div class="afterText" >
      <slot name="afterText"></slot>
    </div>
  </div>

  <div class="hint">{hint}</div>
</div>
