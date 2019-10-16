<script>
  export let backgroundColor = '#706fd3';
  export let elevation = 0;
  export let margin = '0';
  export let onClick = () => {};

  const elevationClass = {
    0: '',
    1: 'elevation-1',
    2: 'elevation-2',
  };

  const classes = `icon-button ${elevationClass[elevation]}`;
  const styles  = `background-color: ${backgroundColor}; margin: ${margin};`;
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

  .elevation-1 {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .elevation-2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .icon-button:hover {
    top: -2px;
    filter: brightness(95%);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: .3s;
  }

  .icon-button__icon {
    font-size: 2em;
    color: white;

    position: relative;
    top: 2px;
  }
</style>

<div class="{classes}" style={styles} on:click={onClick}>
  <slot><!-- optional fallback --></slot>
</div>