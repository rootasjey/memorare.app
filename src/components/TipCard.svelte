<script>
  import { getClient, query } from 'svelte-apollo';
  import { client, TIP } from '../data';

  const tip = query(client, { query: TIP });
</script>

<style>

  .tip-container {
		background: #f1c40f;
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

  .tip-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
</style>

<div class="tip-container">
  {#await $tip}
    <!-- $tip is pending -->
    <div class="tip-loading">
      loading tip...
    </div>
  {:then result}
    <!-- $tip was fulfilled -->
    <div class="tip-content">
      <h1 class="tip-name">Tip content.</h1>
    </div>
  {:catch error}
    <!-- $tip was rejected -->
    <div class="tip-error">
      <h1>An error occurred while loading. Please contact...</h1>
    </div>
  {/await}
</div>
