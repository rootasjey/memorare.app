<script>
  import { navigate } from 'svelte-routing';

  import { store } from '../store';
  import Quotidian from '../components/Quotidian.svelte';

  const savedName = store.getValue('name');
  let username = savedName ? savedName : 'Anonymous';

  if (!username) {
    navigate('/signin');
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

<div class="welcome">
  <div class="welcome__quote">
    <Quotidian />
  </div>
</div>
