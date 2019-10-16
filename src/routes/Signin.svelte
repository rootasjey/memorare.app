<script>
  import { onDestroy }  from 'svelte';
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { fly }        from 'svelte/transition';
  import { navigate }   from 'svelte-routing';

  import Checkbox       from '../components/Checkbox.svelte';
  import ConfirmPass    from '../components/ConfirmPass.svelte';
  import Input          from '../components/Input.svelte';
  import TextLink       from '../components/TextLink.svelte';
  import {
    isUserAuthenticated,
    settings
    } from '../settings';

  import {
    client,
    SIGNIN,
    SIGNUP,
    TINY_LIST_AUTHORS,
  } from '../data';

  const listAuthors = query(client, { query: TINY_LIST_AUTHORS });

  let backgroundStyle = 'background-color: transparent;';
  let colorBackgroundStyle = 'opacity: .8';

  let authors = [];
  let authorQuote = '';
  let authorQuoteFontStyle = 'font-size: 2em;';
  let showAuthorQuote = true;

  // Form variables
  let confirmPassword = '';
  let email           = '';
  let formContainer;
  let isSigninActive  = true;
  let name            = '';
  let password        = '';
  let rememberMe      = false;

  const toggleFormType = () => isSigninActive = !isSigninActive;

  // Authors request
  (async function () {
    let response = await listAuthors.result();

    authors = response.data.listAuthors.entries
      .filter((author) => author.imgUrl !== null);

    backgroundStyle = `background-image: url("${authors[0].imgUrl}")`;
    authorQuote = authors[0].quotes.length > 0 ?
      authors[0].quotes[0].name : '';
  })();

  // Authors slideshow
  let index = 0;
  let timeoutId = 0;

  const intervalId = window.setInterval(() => {
    index = (index + 1) % authors.length;

    colorBackgroundStyle = 'opacity: 1';
    showAuthorQuote = false;

    timeoutId = window.setTimeout(() => {
      const author = authors[index];

      backgroundStyle = `background-image: url("${author.imgUrl}");`;
      colorBackgroundStyle = 'opacity: .8';

      authorQuote = author.quotes.length > 0 ?
        author.quotes[0].name : '';

      authorQuoteFontStyle = authorQuote.length > 100 ?
        'font-size: 1.2em; font-weight: lighter; ' :
        'font-size: 2em; font-weight: bold; ';

      showAuthorQuote = true;

    }, 2000);

  }, 10000);

  onDestroy(() => {
    window.clearInterval(intervalId);
    window.clearTimeout(timeoutId);
  });

  const onEnterNextInput = (event) => {
    const { target } = event;
    const inputs = formContainer.querySelectorAll('input');

    let indexMatch;

    Array
      .from(inputs)
      .some((input, index) => {
        if (input === target) {
          indexMatch = index;
          return true;
        }

        return false;
    });

    if (indexMatch >= inputs.length) { return; }

    const nextInput = inputs[indexMatch + 1];
    if (!nextInput || !nextInput.focus) { return; }

    nextInput.focus();
  }

  const onEnterValidate = () => {
    if (isSigninActive) {
      onSignin();
      return;
    }

    onSignup();
  }

  const onSignin = async () => {
    try {
      const response = await mutate(client, {
        mutation: SIGNIN,
        variables: { login: email, pass: password },
      });

      const { _id, email: userEmail, name: userName, token } = response.data.signin;

      settings.saveData({ _id, email: userEmail, name: userName, token });

      isUserAuthenticated.set(true);

      navigate('/welcome');

    } catch(error) {
      console.error(error);
    }
  }

  const onSignup = async () => {
    try {
      const response = await mutate(client, {
        mutation: SIGNUP,
        variables: { email, name, password },
      });

      const { _id, email: userEmail, name: userName, token } = response.data.signup;

      settings.saveData({ _id, email: userEmail, name: userName, token });

      navigate(`/verifyemail/id=${_id}`);

    } catch (error) {
      // TODO: Redirect to a page.
      console.error(error);
    }
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

  .signin {
    min-height: 100%;
    background-color: #eee;
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .signin__card {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    position: relative;
  }

  .signin__card-left {
    height: 510px;
    width: 400px;
    padding: 20px;

    background-color: #706fd3;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    background-repeat: no-repeat;

    position: relative;

    animation-name: scaleBg;
    animation-duration: 10s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
  }

  @media (max-width: 880px) {
    .signin__card-left {
      height: 200px;
      border-radius: 5px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .signin__card-left__bg-color {
    height: 100%;
    width: 100%;
    background-color: #706fd3;

    position: absolute;
    top: 0;
    left: 0;

    opacity: .8;
    transition: 3s;
  }

  @keyframes scaleBg {
    0% {
      background-size: 100%;
    }
    100% {
      background-size: 110%;
    }
  }

  .signin__card-left__quote {
    height: 90%;
    position: absolute;

    color: white;
    font-size: 2em;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .signin__card-right {
    height: 510px;
    width: 400px;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #eee;
    border-radius: 5px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    transition: .3s;
  }

  .signin__card-right.extended {
    height: 780px;

    transition: .3s;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
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
    width: 219px;

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
    <div class="signin__card-left" style="{backgroundStyle}">
      <div class="signin__card-left__bg-color" style="{colorBackgroundStyle}"></div>

      {#if showAuthorQuote}
        <div class="signin__card-left__quote"
          style="{authorQuoteFontStyle}"
          transition:fly="{{ y: 20, duration: 500 }}">
          <span>{authorQuote}</span>
        </div>
      {/if}
    </div>

    <div class="signin__card-right" class:extended={!isSigninActive}>
      <div class="form-container" bind:this={formContainer}>
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
            <Input label="Email" type="email"
              placeholder="socrate@philo.com"
              bind:inputValue={email} onEnter={onEnterNextInput} />

            <Input label="Password" type="password"
              placeholder="********"
              bind:inputValue={password} onEnter={onEnterValidate} />

            <TextLink text="I forgot my password ?" margin="-10px 0 20px 0" />

            <Checkbox label={"Remember me"} bind:checked={rememberMe} />

            <button class="action-button" on:click={onSignin}>Sign In</button>

            <TextLink text="I don't have an account ?" onClick={toggleFormType} />
          </div>
        {:else}
           <div class="form form-signup" transition:fly="{{ y: 20, duration: 500 }}">
            <Input label="Name" type="name" placeholder="Socrates"
              bind:inputValue={name} checkValue={true}
              errorMessage="Your name contains invalid characters. Only letters, numbers, underscores and hypens allowed."
              onEnter={onEnterNextInput} />

            <Input label="Email" type="email" placeholder="socrate@philo.com"
              errorMessage="The value entered is not an email."
              bind:inputValue={email} checkValue={true}
              onEnter={onEnterNextInput} />

            <Input label="Password" type="password" placeholder="********"
              errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
              bind:inputValue={password} checkValue={true}
              onEnter={onEnterNextInput} />

            <ConfirmPass label="Confirm Password" placeholder="********"
              bind:inputValue={confirmPassword} valueToCheck={password}
              errorMessage="This value doesn't match the previous entered password."
              onEnter={onEnterValidate} />

            <button class="action-button" on:click={onSignup}>Sign Up</button>

            <TextLink text="I already have an account ?" onClick={toggleFormType} />
           </div>
        {/if}
      </div>
    </div>
  </div>
</div>
