<script>
  import { fly }      from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import Quotidian    from '../components/Quotidian.svelte';

  import {
    logout,
    settings,
  } from '../settings';

  let username = settings.getValue('name');

  if (typeof username !== 'string' || username.length === 0) {
    logout();
  }
</script>

<style>
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 30px;

    position: relative;
  }

  .welcome__quote {
    min-height: 400px;
    min-width: 100%;
    padding: 50px;

    background-color: #FBAB7E;
    background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>

<div class="welcome" transition:fly={{ y: 10, duration: 500 }}>
  <div class="welcome__quote">
    <Quotidian />
  </div>
</div>
