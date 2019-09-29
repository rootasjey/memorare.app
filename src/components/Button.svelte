<script>
  export let additionalClass  = '';
  export let dataIndex        = 0;
  export let dataValue        = '';
  export let margin           = 0;
  export let onClick          = () => {};
  export let value            = '';

  let classes     = `button ${additionalClass}`;
  let marginRule  = `margin: ${margin}; `;
  let styles      = `${marginRule}`;
</script>

<style>
  .button {
    background: white;
    padding: 15px;
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    display: flex;
    align-items: center;

    text-transform: uppercase;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .button:hover {
    color: white;
    background: #706fd3;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    transform: translateY(-5px);
  }

  .button > svg {
    margin-right: 10px;
    margin-left: 10px;
  }

  .button > svg:first-child {
    margin-right: 10px;
  }

  .button > svg:last-child {
    margin-left: 10px;
  }

  .button:hover > svg {
    fill: white;
  }

</style>

<div class={classes} style="{styles}"
  data-index={dataIndex} data-value={dataValue} on:click={onClick}>
  <slot></slot>
  <span>{value}</span>
</div>
