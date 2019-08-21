<script>
  export let color = '#f56498';
  export let fontSize = '.8em';
  export let onClick = () => {}
  export let text = '';

  let styles = `color: ${color}; font-size: ${fontSize};`;
</script>

<style>
  .text-link {
    font-size: .8em;
    color: #f56498;
    margin: auto;

    cursor: pointer;
    position:relative;
    transition:0.5s color ease;
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

</style>

<div class="text-link" style="{styles}" on:click={onClick}>
  <span>{text}</span>
</div>
