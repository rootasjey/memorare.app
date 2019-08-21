<script>
  export let color      = '#706fd3';
  export let height     = '20px';
  export let visibility = 'visible';
  export let width      = '20px';

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
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
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
