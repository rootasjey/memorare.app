<script>
  export let value = '';
  // Styles
  export let color = '';
  export let bgColor = '';
  export let margin = '';
  export let borderRadius = '';
  export let outline = false;
  export let border = '';

  let borderCSS       = border        ? `border: ${border};`              : '';
  let borderRadiusCSS = borderRadius  ? `border-radius: ${borderRadius};` : '';
  let bgColorCSS      = bgColor       ? `background-color: ${bgColor};`   : '';
  let colorCSS        = color         ? `color: ${color};`                : '';
  let marginCSS       = margin        ? `margin: ${margin};`              : '';

  let styles = `${colorCSS} ${bgColorCSS} ${marginCSS} ${borderRadiusCSS} ${borderCSS}`;

</script>

<style>
  .label {
    color: #fff;
    background-color: #706fd3;
    align-self: flex-start;
    margin-bottom: 10px;
    padding: 5px 10px;

    border: 1px solid #706fd3;
    border-radius: 5px;

    text-transform: uppercase;
  }

  .label.outline {
    background-color: transparent;
  }
</style>

<span class="label" class:outline style="{styles}">
  {value}
</span>
