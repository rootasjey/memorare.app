<script>
  import { fly } from 'svelte/transition';

  import Checkbox from '../components/Checkbox.svelte';

  let email = '';
  let password = '';
  let login = '';
  let isRememberMeActive = false;

  let isSigninActive = true;
  let rememberMe = false;

  const toggleFormType = () => isSigninActive = !isSigninActive;
</script>

<style>
  .button-pink-round {
    color: white;
    background-color: #f56498;

    margin-top: 20px;
    padding: 10px 15px;

    border: 0;
    border-radius: 30px;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    position: relative;
    top: 0;

    transition: .3s;
  }

  .button-pink-round:hover {
    background-color: #706fd3;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    position: relative;
    top: -5px;

    transition: .3s;
  }

  .nav-marker {
    height: 5px;
    width: 40px;
    background-color: #f56498;
    border-radius: 10px;

    position: absolute;
    transition: .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .nav-marker.left {
    left: 35px;
    top: 42px;
  }

  .nav-marker.right {
    left: 110px;
    top: 42px;
  }

  .signin {
    min-height: 100%;
    background-color: #eee;
    padding-top: 50px;
  }

  .signin__card {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    position: relative;
  }

  .signin__card-left {
    height: 450px;
    width: 400px;
    padding: 20px;

    background-color: #706fd3;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .signin__card-right {
    height: 450px;
    width: 400px;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #eee;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    min-height: 200px;
    padding: 40px;

    background-color: white;

    position: absolute; /* for form transition */

    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    z-index: 2;
  }

  .form > label {
    color: #706fd3;
  }

  .form > input {
    margin-bottom: 20px;

    border: 0;
    border-bottom: 2px solid #706fd3;

    opacity: .3;
    transition: .3s;
  }

  .form > input:focus {
    opacity: 1;
    border: 0;
    border-bottom: 2px solid #706fd3;
    transition: .3s;
  }

  .form-container > nav {
    background-color: #eee;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    padding: 20px 30px;
    padding-bottom: 25px;
    margin-bottom: -5px;
    width: 199px;

    position: relative;
    top: 10px;

    display: flex;


    z-index: 1;
  }

  .form-container > nav > span {
    cursor: pointer;
    margin-right: 20px;
    font-weight: bold;
    opacity: .3;
    transition: .5s;
  }

  .form-container > nav > span:hover {
    opacity: .7;
    transition: .5s;
  }

  .form-container > nav > span.active {
    opacity: .7;
  }

</style>

<div class="signin">
  <div class="signin__card">
    <div class="signin__card-left"></div>

    <div class="signin__card-right">
      <div class="form-container">
        <nav>
          <span class:active="{isSigninActive}" on:click={toggleFormType}>Sign In</span>
          <span class:active="{!isSigninActive}" on:click={toggleFormType}>Sign Up</span>

          <div class="nav-marker"
              class:left="{isSigninActive}"
              class:right="{!isSigninActive}"
              transition:fly="{{ y: 20, duration: 1000 }}"></div>
        </nav>

        {#if isSigninActive}
          <div class="form form-signin" transition:fly="{{ y: -20, duration: 500 }}">
            <label for="email" >Email</label>
            <input bind:value={email} type="text" name="email" placeholder="socrate@philo.com">

            <label for="password">Password</label>
            <input bind:value={password} type="password" name="password" placeholder="********">

            <Checkbox label={"Remember me"} bind:checked={rememberMe} />

            <button class="button-pink-round">Sign In</button>
          </div>
        {:else}
           <div class="form form-signup" transition:fly="{{ y: 20, duration: 500 }}">
           <label for="email" >Email</label>
            <input bind:value={email} type="text" name="email" placeholder="socrate@philo.com">

            <label for="password">Password</label>
            <input bind:value={password} type="text" name="password" placeholder="********">

            <label for="password">Login</label>
            <input bind:value={login} type="text" name="login" placeholder="socrate">

            <button class="button-pink-round">Sign Up</button>
           </div>
        {/if}
      </div>
    </div>
  </div>
</div>
