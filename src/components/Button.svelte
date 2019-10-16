<script>
  export let additionalClass  = '';
  export let margin           = 0;
  export let onClick          = () => {};
  export let value            = '';
  export let outlined         = false;

  let baseClass   = outlined ? 'button-outlined' : 'button';
  let classes     = `${baseClass} ${additionalClass}`;
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

  .button-outlined {
    padding: 10px;
    color: #706fd3;
    border: 1px solid #706fd3;
    border-radius: 3px;

    cursor: pointer;
    text-transform: uppercase;
    transition: .3s;
  }

  .button-outlined:hover {
    color: #f56498;
    border: 1px solid #f56498;
    transition: .3s;
  }

</style>

<div class={classes} style="{styles}" on:click={onClick}>
  <slot></slot>
  <span>{value}</span>
</div>
