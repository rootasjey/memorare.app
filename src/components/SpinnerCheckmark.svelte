<script>
  // TODO: More flexible -> need CSS var
  export let checkColor = '#706fd3';
  export let size = '7em';
  export let isCompleted = false;

  let circleLoaderStyle = `
    border-left-color: ${checkColor};
    margin-bottom: 3.5em;
    width: ${size};
    height: ${size};
    `;
</script>

<style>
  .circle-loader {
    border: 3px solid rgba(0, 0, 0, 0.2);
    animation: loader-spin 1.2s infinite linear;
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    align-self: center;
  }

  .load-complete {
    border-color: #706fd3;
    -webkit-animation: none;
    animation: none;
    transition: border 500ms ease-out;
  }

  .checkmark {
    display: block;
  }

  .checkmark--hidden {
    display: none;
  }

  .checkmark.draw:after {
    animation-duration: 800ms;
    animation-timing-function: ease;
    animation-name: checkmark;
    transform: scaleX(-1) rotate(135deg);
  }

  .checkmark:after {
    opacity: 1;
    height: 3.5em;
    width: 1.75em;
    transform-origin: left top;
    border-right: 3px solid #706fd3;
    border-top: 3px solid #706fd3;
    content: '';
    left: 1.5em;
    top: 3.5em;
    position: absolute;
  }

  @keyframes loader-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes checkmark {
    0% {
      height: 0;
      width: 0;
      opacity: 1;
    }
    20% {
      height: 0;
      width: 1.75em;
      opacity: 1;
    }
    40% {
      height: 3.5em;
      width: 1.75em;
      opacity: 1;
    }
    100% {
      height: 3.5em;
      width: 1.75em;
      opacity: 1;
    }
  }
</style>

<div class="circle-loader" class:load-complete="{isCompleted}" style="{circleLoaderStyle}">
  <div class="checkmark draw" class:checkmark--hidden="{isCompleted === false}"></div>
</div>
