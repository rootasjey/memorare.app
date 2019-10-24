<script>
  import { onMount }  from 'svelte';
  import { query }    from 'svelte-apollo';

  import Spinner      from '../components/Spinner.svelte';

  import {
    client,
    IS_EMAIL_VALID,
    IS_NAME_VALID,
    IS_PASSWORD_VALID
  } from '../data';

  // Props. (external)
  export let bgColor      = '';
  export let borderColor  = '';
  export let checkValue   = false;      // activate front + back checks
  export let color        = '';
  export let errorMessage = '';
  export let inputValue   = '';         // actual value
  export let isValid      = true;      // frontend + backend checks
  export let label        = '';         // text displayed on top
  export let lightcontent = false;
  export let margin       = '';
  export let onEnter      = () => {};
  export let outlined     = false;
  export let pattern      = '';         // regex for frontend check
  export let placeholder  = '';         // when value is empty
  export let type         = 'text';

  // Props. (internal)
  let inputInitialValue   = inputValue;
  let isChecking          = false;      // checking data to backend
  let isDirty             = false;
  let isFormatValid       = false;      // value matches regex (frontend)

  // Input's pattern choice
  const patterns = {
    email   : "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
    password: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$", // At least 8 characters, 1 number, 1 lower-case letter, 1 upper-case letter
    name   : "^[\\p{L}0-9-._ ]{3,64}$", // Only alphanumeric, hyphens, dots, spaces, underscores.
  };

  if (!pattern && checkValue) {
    pattern = patterns[type] ? patterns[type] : '';
  }

  $: borderColorCSS = borderColor ? `border-color: ${borderColor};` : '';
  $: bgColorCSS = bgColor ? `background-color: ${bgColor};` : '';
  $: colorCSS = color ? `color: ${color};` : '';
  $: marginCSS = margin ? `margin: ${margin};` : '';

  $: styles = `${borderColorCSS} ${bgColorCSS} ${colorCSS} ${marginCSS}`;

  let input; // bind this

  onMount(() => {
    // Re-check (fetch) input's value if not empty.
    if (!inputValue || !checkValue) { return; }
    onChange();
  });

  const getQuery = () => {
    if (type.toLowerCase() === 'email') {
      return IS_EMAIL_VALID;

    } else if (type.toLowerCase() === 'name') {
      return IS_NAME_VALID;

    } else if (type.toLowerCase() === 'password') {
      return IS_PASSWORD_VALID;
    }
  }

  const getVariables = () => {
    if (type.toLowerCase() === 'email') {
      return { email: inputValue };

    } else if (type.toLowerCase() === 'name') {
      return { name: inputValue };

    } else if (type.toLowerCase() === 'password') {
      return { password: inputValue };
    }
  }

  const getResponseKey = () => {
    if (type.toLowerCase() === 'email') {
      return 'isEmailValid';

    } else if (type.toLowerCase() === 'name') {
      return 'isNameValid';

    } else if (type.toLowerCase() === 'password') {
      return 'isPasswordValid';
    }
  }

  const onChange = () => {
    if (!checkValue || inputInitialValue === inputValue) { return; }
    isDirty = true;

    isFormatValid = input.checkValidity();

    if (!isFormatValid) {
      isValid = false;
      return;
    }

    isChecking = true;

    const fetchQuery = query(client, {
      query: getQuery(),
      variables: getVariables(),
    });

    fetchQuery.result()
      .then((response) => {
        isChecking = false;
        const booleanMessage = response.data[getResponseKey()];

        isValid = booleanMessage.bool && isFormatValid;

        errorMessage = booleanMessage.message ? booleanMessage.message : '';
      })
      .catch((reason) => {
        isChecking = false;
        isValid = false;
      });
  }

  const onKeyUp = (event) => {
    const reEnter = /Enter/ig;

    if (reEnter.test(event.code)) {
      onEnter(event);
    }
  }
</script>

<style>
  .check-icon {
    color: #a3cb38;
    font-size: 1.5em;
  }

  .cross-icon {
    color: #f56498;
    font-size: 1.5em;
  }

  .error-message {
    font-size: 0.9em;
    color: #f56498;
    display: none;
    transition: .3s;
  }

  .error-message.visible {
    display: block;
    transition: .3s;
  }

  label {
    color: #706fd3;
  }

  input {
    width: 100%;

    border: 0;
    border-bottom: 2px solid #706fd3;

    transition: .3s;
  }

  input:focus {
    border: 0;
    border-bottom: 2px solid #706fd3;
    transition: .3s;
  }

  input:required {
    box-shadow: none;
  }

  input.outlined {
    height: 40px;
    border: 1px solid #706fd3;
    background-color: #eee;

    margin-right: 10px;
  }

  input.lightcontent {
    color: #fff;
  }

  input.lightcontent::placeholder {
    color: #fff;
  }

  .input-container {
    width: 100%;
  }

  .input-interactions {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .row {
    display: flex;
  }

</style>

<div class="input-container">
  <label for="input" >{label}</label>

  <div class="input-interactions">
    <div class="row">
      {#if type.toLowerCase() === 'email'}
        <input bind:value={inputValue} bind:this={input}
              class:outlined
              class:lightcontent
              style={styles}
              type="email" name="input" placeholder="{placeholder}" required
              pattern="{pattern}" on:change={onChange} on:keyup={onKeyUp}>

      {:else if type.toLowerCase() === 'password'}
        <input bind:value={inputValue} bind:this={input}
              class:outlined
              class:lightcontent
              style={styles}
              type="password" name="input" placeholder="{placeholder}" required
              pattern="{pattern}" on:change={onChange} on:keyup={onKeyUp}>
      {:else}
        <!-- else type === 'text' -->
        <input bind:value={inputValue} bind:this={input}
              class:outlined
              class:lightcontent
              style={styles}
              type="text" name="input" placeholder="{placeholder}" required
              pattern="{pattern}" on:change={onChange} on:keyup={onKeyUp}>
      {/if}

      {#if checkValue && isDirty}
        {#if isChecking}
          <Spinner />
        {:else if isValid}
          <span class="check-icon">&#10003;</span>
        {:else}
          <span class="cross-icon">&#215;</span>
        {/if}
      {/if}
    </div>

    <div class="error-message" class:visible={!isValid}>
      <span>{errorMessage}</span>
    </div>
  </div>
</div>
