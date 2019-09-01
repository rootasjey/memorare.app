<script>
  export let color    = '#f56498';
  export let disabled = false;
  export let fontSize = '.8em';
  export let margin   = 'auto';
  export let onClick  = () => {}
  export let text     = '';

  let classes = 'text-link';

  $: styles = `color: ${color}; font-size: ${fontSize}; margin: ${margin}`;

  $: if (disabled) {
    classes = 'text-link disabled';
    color = '#535c68';

  } else { classes = 'text-link'; color = '#f56498'; }

</script>

<style>
  .text-link {
    font-size: .8em;

    cursor: pointer;
    position:relative;
    transition: 0.5s color ease;
  }

  .text-link:after {
    content: "";
    transition:0.5s all ease;
    -webkit-backface-visibility:hidden;
            backface-visibility:hidden;
    position:absolute;
    bottom:-0.25em;
    left:0;

    height:1px;
    width:0;
    background:#f56498;
  }

  .text-link:hover:after {
    width: 100%;
  }

  .text-link:hover {
    transition: .3s;
  }

  .text-link.disabled {
    cursor: default;
  }

  .text-link.disabled:after {
    background: transparent;
  }

</style>

<div class="{classes}" style="{styles}" on:click={onClick}>
  <span>{text}</span>
</div>
