<script>
  export let caption = '';
  export let margin = '';
  export let title = '';
  export let titleSize = '';

  let marginRule    = margin    ? `margin: ${margin};`        : '';
  let titleSizeRule = titleSize ? `font-size: ${titleSize};`  : '';

  let style = `${marginRule}`;
  let titleStyle = ` ${titleSizeRule}`;
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

 <header style="{style}">
    <span class="sub-header">{caption}</span>
    <h1 style="{titleStyle}">{title}</h1>
  </header>
