<script>
  export let backgroundColor = '#706fd3';
  export let elevation = 0;
  export let margin = '0';
  export let height = '';
  export let tabindex = 0;
  export let width = '';

  const elevationClass = {
    0: '',
    1: 'elevation-1',
    2: 'elevation-2',
  };

  const classes     = `icon-button ${elevationClass[elevation]}`;
  const bgColorRule = backgroundColor ? `background-color: ${backgroundColor};` : '';
  const marginRule  = margin  ? `margin: ${margin};`  : '';
  const heightRule  = height  ? `height: ${height};`  : '';
  const widthRule   = width   ? `width: ${width};`    : '';
  const style       = `${bgColorRule} ${marginRule}; ${widthRule} ${heightRule}`.trim();

  let domIconButton;

  function onKeyUp(keyboardEvent) {
    const { keyCode } = keyboardEvent;

    switch (keyCode) {
      case 13:
        domIconButton.dispatchEvent(new Event('click'));
        break;

      default:
        break;
    }
  }
</script>

<style>
  .icon-button {
    cursor: pointer;

    height: 45px;
    width: 45px;

    position: relative;
    top: 0;

    border-radius: 50%;
    background-color: #706fd3;

    color: white;
    line-height: 2em;
    text-transform: uppercase;

    text-align: center;
    outline: none;
    transition: .3s;
  }

  .elevation-1 {
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .elevation-2 {
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .icon-button:hover,
  .icon-button:focus {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .icon-button:active {
    filter: brightness(60%);
    transform: translateY(3px);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 2px;
  }

  .svg-container {
    position:relative;
    top: 10px;
  }
</style>

<div
  class="{classes}"
  style={style}
  on:keyup={onKeyUp}
  on:click
  bind:this={domIconButton}
  tabindex={tabindex}>

  <slot name="txt"><!-- optional fallback --></slot>

  <div class="svg-container">
    <slot name="svg"></slot>
  </div>
</div>