<script>
  export let color      = '#706fd3';
  export let height     = '10px';
  export let visibility = 'visible';
  export let width      = '10px';

  $: heightPx = height.indexOf('px')  > -1 ? height : `${height}px`;
  $: widthPx  = width.indexOf('px')   > -1 ? width  : `${width}px`;

  $: styles = `
    visibility: ${visibility};
    border-top-color: ${color};
    height: ${heightPx};
    width: ${widthPx}
  `;

</script>

<style>
  .spinner {
    display: inline-block;
    border: 3px solid #716fd39c;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
</style>

<div class="spinner" style="{styles}"></div>
