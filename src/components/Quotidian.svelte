<script>
  import { getClient, query } from 'svelte-apollo';
  import { client, QUOTIDIAN } from '../data';

  const quotidian = query(client, { query: QUOTIDIAN });

  export let top = '0';

  let style = `
    top: ${top};
  `;
</script>

<style>
  .quote-container {
		background: #706fd3;
		border-radius: 2px;
    color: white;
    cursor: pointer;

    margin: auto;
		padding: 50px;
    width: 50%;

    position: relative;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quote-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quote-footer {
    text-align: right;
  }
</style>

<div class="quote-container" style="{style}">
  {#await $quotidian}
    <!-- $quotidian is pending -->
    <div class="quote-loading">
      loading quote...
    </div>
  {:then result}
    <!-- $quotidian was fulfilled -->
    <div class="quote-content">
      <h1 class="quote-name"> {result.data.quotidian.name} </h1>

      <div class="quote-footer">
        <h4>{result.data.quotidian.author}</h4>

        {#if result.data.quotidian.references.length}
          <p>{result.data.quotidian.references[0]}</p>
        {/if}
      </div>
    </div>
  {:catch error}
    <!-- $quotidian was rejected -->
    <div class="quote-error">
      <h1>An error occurred while loading. Please contact...</h1>
    </div>
  {/await}
</div>
