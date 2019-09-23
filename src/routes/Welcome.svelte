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

    background:
      radial-gradient(circle at 100% 50%, transparent 20%, #00D4F0 21%,
        #00D4F0 34%, transparent 35%, transparent),
      radial-gradient(circle at 0% 50%, transparent 20%, #00D4F0 21%, #00D4F0 34%, transparent 35%, transparent) 0 -50px;
    background-color: #EEEEEE;
    background-size: 75px 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .welcome__tip {
    min-height: 400px;
    min-width: 100%;
    padding: 50px;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: white;
    background-color: #FBAB7E;
    background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);
  }

  .welcome__fact {
    min-height: 400px;
    min-width: 100%;
    padding: 50px;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: white;
    background-color: #08AEEA;
    background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);
  }
</style>

<div class="welcome">
  <div class="welcome__quote">
    <Quotidian />
  </div>

  <div class="welcome__tip">
    <h1>Tip</h1>
  </div>

  <div class="welcome__fact">
    <h1>Fact</h1>
  </div>
</div>
