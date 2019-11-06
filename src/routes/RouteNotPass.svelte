<script>
  import { navigate } from 'svelte-routing';
  import RectButten from '../components/RectButton.svelte';
</script>

<style>
  .illustration {
    margin: 50px;
  }

  .route-not-pass {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row-buttons {
    display: flex;
    margin-top: 50px;
  }
</style>

<div class="route-not-pass">
  <header>
    <h1>You shall not pass</h1>
    <span>
      You don't have access to this content.
      <br>Please turn back without looking.
    </span>
  </header>

  <div class="illustration">
    <img src="/img/shall-not-pass.png" alt="shall not pass image" width="300">
  </div>

  <div class="row-buttons">
    <RectButten value="Go Back" on:click={() => history.back()} />
    <RectButten value="Home" on:click={() => navigate('/')} />
  </div>
</div>
