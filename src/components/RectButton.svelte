<script>
  export let bg         = '';
  export let color      = '';
  export let height     = '';
  export let hide       = false;
  export let hint       = '';
  export let margin     = '';
  export let outline    = false;
  export let primary    = false;
  export let secondary  = false;
  export let value      = '';
  export let width      = '';

  let bgRule      = bg      ? `background: ${bg};`: '';
  let colorRule   = color   ? `color: ${color};`  : '';
  let marginRule  = margin  ? `margin: ${margin};`: '';
  let widthRule   = width   ? `width: ${width};`  : '';
  let heightRule  = height  ? `height: ${height};`: '';

  let style = `${bgRule} ${colorRule} ${marginRule} ${widthRule} ${heightRule}`;
</script>

<style>
  .button {
    min-width: 80px;
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

  .button:hover {
    filter: brightness(90%);
    transform: translateY(2px);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
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

  .outline {
    color: #fff;
    background-color: transparent;
    border: 3px solid #fff;
  }

  .outline.secondary {
    color: #f56498;
    background-color: transparent;
    border: 3px solid #f56498;
  }


  .hint {
    margin-top: 10px;
    color: rgba(0,0,0,0.5);
  }

  .rect-button {
    margin: 10px;
  }
</style>

<div
  class="rect-button"
  style="{style}"
  on:click>

  <slot></slot>
  <div class="button"
    class:primary
    class:secondary
    class:outline
    class:hide>
    {value}
  </div>

  <div class="hint">{hint}</div>
</div>
