<script>
  import { getClient, query } from 'svelte-apollo';
  import { client, QUOTIDIAN } from './data';

  const quotidian = query(client, { query: QUOTIDIAN });
</script>

<style>
  .quote-container {
		background: #2ecc71;
		border-radius: 5px;
    color: white;
    cursor: pointer;

    margin: auto;
		padding: 50px;
    width: 50%;

    position: relative;
    top: 0px;

		-webkit-box-shadow: 6px 10px 14px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 6px 10px 14px 0px rgba(0,0,0,0.75);
    box-shadow: 6px 10px 14px 0px rgba(0,0,0,0.75);

    transition: .5s;
  }

  .quote-container:hover {
    top: -10px;

    -webkit-box-shadow: 6px 10px 24px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 6px 10px 24px 0px rgba(0,0,0,0.75);
    box-shadow: 6px 10px 24px 0px rgba(0,0,0,0.75);

    transition: .5s;
  }

  .quote-footer {
    text-align: right;
  }
</style>

<div class="quote-container">
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
    <h1>An error occurred while loading. Please contact...</h1>
  {/await}
</div>
