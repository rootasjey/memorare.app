<script>
  export let active = false;
  export let fullSize = false;
  export let maxHeight = -1;
  export let maxWidth = -1;

  $: maxWidthCSS  = maxWidth > 0 ? `max-width: ${maxWidth}px` : '';
  $: maxHeightCSS = maxHeight > 0 ? `max-height: ${maxHeight}px` : '';
  $: styles = `${maxWidthCSS} ${maxHeightCSS}`;

  function onClickToClose() {
    active = false;
  }
</script>

<style>
  .dialog-component {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    min-width: 100%;
    min-height: 100%;

    position: fixed;
    top: 0;
    left: 0;

    z-index: 10;
  }

  .dialog-component.active {
    display: flex;
  }

  .dialog-background {
    background-color: #000;
    opacity: .5;

    min-width: 100%;
    min-height: 100%;

    position: absolute;

    z-index: 11;
  }

  .active .dialog-background {
    animation-name: opacityIn;
    animation-duration: .3s;
  }

  .dialog-content {
    min-width: 150px;
    min-height: 150px;
    padding: 30px;

    background-color: #eee;

    border-radius: 5px;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);

    z-index: 12;
  }

  .fullSize .dialog-content {
    min-width: 100%;
    min-height: 100%;

    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .active .dialog-content {
    animation-name: scaleIn;
    animation-duration: .3s;
  }

  @keyframes scaleIn {
    0% {
      transform: scale(.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes opacityIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: .5;
    }
  }
</style>

<div class="dialog-component" class:active class:fullSize>
  <div class="dialog-background" on:click={onClickToClose}></div>
  <div class="dialog-content" style="{styles}">
    <slot name="content"></slot>
  </div>
</div>
