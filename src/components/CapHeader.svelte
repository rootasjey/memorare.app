<script>
  export let caption = '';
  export let title = '';

  export let margin = '';

  let marginCSS = margin ? `margin: ${margin}` : '';

  let styles = `${marginCSS}`;
</script>

<style>
  header {
    margin: 20px 0;
  }

  .sub-header {
    font-weight: bold;
    text-transform: uppercase;
  }

  h1 {
    margin-top: 0;
  }
</style>

 <header style="{styles}">
    <span class="sub-header">{caption}</span>
    <h1>{title}</h1>
  </header>
