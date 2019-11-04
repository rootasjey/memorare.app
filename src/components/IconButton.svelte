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
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .elevation-2 {
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .icon-button:hover {
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

<div class="{classes}" style={styles} on:click={onClick}>
  <slot name="txt"><!-- optional fallback --></slot>

  <div class="svg-container">
    <slot name="svg"></slot>
  </div>
</div>