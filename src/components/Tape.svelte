<script>
  export let bgColor  = '';
  export let color    = '';
  export let value    = '';

  let bgColorRule = bgColor ? `background-color: ${bgColor};` : '';
  let colorRule   = color   ? `background-color: ${color};`   : '';

  let style = `${bgColorRule} ${colorRule}`;
</script>

<style>
  .tap {
    font-size: 1.3em;
    margin: auto;
    color: rgba(0,0,0,0.5);

    max-width: 600px;

    position: relative;
    z-index: 2;
  }

  .tap > span {
    color: white;
    background-color: #f56498;
    padding: 5px;
    line-height: 1.6em;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }
</style>

<div class="tap" style="{style}">
  <span>
    <slot></slot>
    {value}
  </span>
</div>
