<script>
  import { fly }        from 'svelte/transition';
  import { navigate }   from 'svelte-routing';

  import Checkbox       from '../components/Checkbox.svelte';
  import ConfirmPass    from '../components/ConfirmPass.svelte';
  import Input          from '../components/Input.svelte';
  import TextLink       from '../components/TextLink.svelte';

  import {
    client,
    SIGNIN,
    SIGNUP,
  } from '../data';

  import { handle }     from '../errors';

  import {
    isUserAuthenticated,
    settings
  } from '../settings';

  import { onEnterNextInput } from '../utils';

  // Form variables
  let confirmPassword = '';
  let email           = '';
  let formContainer;
  let isSigninActive  = true;
  let name            = '';
  let password        = '';
  let rememberMe      = false;

  const toggleFormType = () => isSigninActive = !isSigninActive;

  const onEnterValidate = () => {
    if (isSigninActive) {
      onSignin();
      return;
    }

    onSignup();
  }

  const onSignin = async () => {
    try {
      const response = await client.mutate({
        mutation: SIGNIN,
        variables: { email, password },
      });

      const { id, email: userEmail, lang, name: userName, rights, token } = response.data.signin;

      settings.saveData({ id, email: userEmail, lang, name: userName, rights, token });

      isUserAuthenticated.set(true);

      navigate('/welcome');

    } catch(error) {
      handle(error);
    }
  }

  const onSignup = async () => {
    try {
      const response = await client.mutate({
        mutation: SIGNUP,
        variables: { email, name, password },
      });

      const { id, email: userEmail, lang, name: userName, rights, token } = response.data.signup;

      settings.saveData({ id, email: userEmail, lang, name: userName, rights, token });

      navigate(`/verify/email/0`);

    } catch (error) {
      handle(error);
    }
  }

  function _onEnterNextInput(customEvent) {
    onEnterNextInput(customEvent, formContainer);
  }
</script>

<style>
  .action-button {
    align-self: stretch;
    color: white;
    background-color: #706fd3;

    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px 15px;

    border: 0;
    border-radius: 30px;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    position: relative;
    top: 0;

    transition: .3s;
  }

  .action-button:hover {
    background-color: #f56498;
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

  .signin-page {
    min-height: 100%;
    background-color: #eee;
    padding-top: 50px;
    padding-bottom: 50px;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    position: relative;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 300px;
    min-height: 200px;
    padding: 40px;

    background-color: white;

    position: absolute; /* for form transition */

    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    z-index: 2;
  }

  .form-container > nav {
    background-color: #eee;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    padding: 20px 30px;
    padding-bottom: 25px;
    margin-bottom: -5px;
    width: 319px;

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

<div class="signin-page">
  <div class="form-container" bind:this={formContainer}>
  <nav>
    <span class:active="{isSigninActive}" on:click={toggleFormType}>Sign In</span>
    <span class:active="{!isSigninActive}" on:click={toggleFormType}>Sign Up</span>

    <div class="nav-marker"
      class:left="{isSigninActive}"
      class:right="{!isSigninActive}"
      in:fly="{{ y: 20, duration: 1000 }}"></div>
  </nav>

  {#if isSigninActive}
    <div class="form form-signin" transition:fly="{{ y: -20, duration: 250 }}">
      <Input
        label="Email"
        type="email"
        placeholder="socrate@philo.com"
        bind:inputValue={email}
        on:enter={_onEnterNextInput} />

      <Input
        label="Password"
        type="password"
        placeholder="********"
        bind:inputValue={password}
        on:enter={onEnterValidate} />

      <TextLink text="I forgot my password ?"
        margin="-10px 0 20px 0"
        onClick={() => navigate('/forget/password')}
      />

      <br>

      <Checkbox label={"Remember me"} bind:checked={rememberMe} />
      <br>

      <button class="action-button" on:click={onSignin}>Sign In</button>

      <TextLink text="I don't have an account ?" margin="0 auto" onClick={toggleFormType} />
    </div>
  {:else}
      <div class="form form-signup" transition:fly="{{ y: 20, duration: 250 }}">
        <Input label="Name" type="name" placeholder="Socrates"
          bind:inputValue={name} checkValue={true}
          errorMessage="Your name contains invalid characters. Only letters, numbers, underscores and hypens allowed."
          on:enter={_onEnterNextInput} />

        <Input label="Email" type="email" placeholder="socrate@philo.com"
          errorMessage="The value entered is not an email."
          bind:inputValue={email} checkValue={true}
          on:enter={_onEnterNextInput} />

        <Input label="Password" type="password" placeholder="********"
          errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
          bind:inputValue={password} checkValue={true}
          on:enter={_onEnterNextInput} />

        <ConfirmPass
          label="Confirm Password"
          placeholder="********"
          bind:inputValue={confirmPassword}
          valueToCheck={password}
          errorMessage="This value doesn't match the previous entered password."
          on:enter={onEnterValidate} />

        <button class="action-button" on:click={onSignup}>Sign Up</button>

        <TextLink text="I already have an account ?" margin="0 auto" onClick={toggleFormType} />
      </div>
  {/if}
</div>
</div>
