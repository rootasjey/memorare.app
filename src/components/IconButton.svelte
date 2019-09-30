<script>
  export let backgroundColor = '#706fd3';
  export let onClick = () => {};
  export let margin = '0';

  const styles = `background-color: ${backgroundColor}; margin: ${margin}; `;
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
    transition: .3s;
  }

  .icon-button:hover {
    top: -2px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: .3s;
  }

  .icon-button > svg {
    position: relative;
    top: 10px;
  }

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 2px;
  }
</style>

<div class="icon-button" style={styles} on:click={onClick}>
  <slot><!-- optional fallback --></slot>
</div>