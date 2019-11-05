<script>
  import {
    createEventDispatcher,
    onMount
  }  from 'svelte';

  import Spinner from '../components/Spinner.svelte';

  import {
    client,
    IS_EMAIL_VALID,
    IS_NAME_VALID,
    IS_PASSWORD_VALID
  } from '../data';

  // Props. (external)
  export let bgColor      = '';
  export let borderColor  = '';
  export let checkValue   = false;       // activate front + back checks
  export let color        = '';
  export let errorMessage = '';
  export let height       = '';
  export let inputValue   = '';         // actual value
  export let isValid      = true;       // frontend + backend checks
  export let label        = '';         // text displayed on top
  export let lightcontent = false;
  export let margin       = '';
  export let noBackCheck  = false;      // value won't be checked gainst backend
  export let outlined     = false;
  export let pattern      = '';         // regex for frontend check
  export let placeholder  = '';         // when value is empty
  export let type         = 'text';

  // Props. (internal)
  let backendMessage      = '';
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
  $: bgColorCSS     = bgColor     ? `background-color: ${bgColor};` : '';
  $: colorCSS       = color       ? `color: ${color};`              : '';
  $: marginCSS      = margin      ? `margin: ${margin};`            : '';
  let heightRule = height ? `height: ${height};` : '';

  $: styles = `${borderColorCSS} ${bgColorCSS} ${colorCSS} ${heightRule} ${marginCSS}`;

  let input; // bind this

  const dispatch = createEventDispatcher();

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

  async function onChange() {
    backendMessage = '';

    if (!checkValue || inputInitialValue === inputValue) { return; }
    isDirty = true;

    isFormatValid = input.checkValidity();

    if (!isFormatValid) {
      isValid = false;
      return;
    }

    if (noBackCheck) { return; }

    isChecking = true;

    try {
      const response = await client.query({
        query: getQuery(),
        variables: getVariables(),
      });

      isChecking = false;
      const booleanMessage = response.data[getResponseKey()];

      isValid = booleanMessage.bool && isFormatValid;

      backendMessage = booleanMessage.message ? booleanMessage.message : '';

    } catch (error) {
      isChecking = false;
      isValid = false;
    }
  }

  const onKeyUp = (event) => {
    if (event.keyCode === 13) {
      dispatch('enter', { event, target: input });
    }
  }
</script>

<style>
  .check-icon {
    color: #a3cb38;
    font-size: 1.5em;

    margin: 0 10px;

    position: relative;
    top: -2px;
  }

  .cross-icon {
    color: #f56498;
    font-size: 1.5em;

    margin: 0 10px;

    position: relative;
    top: -2px;
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

    position: relative;
    top: 0;

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    margin-right: 10px;
    transition: .3s;
  }

  input.outlined:hover {
    top: 2px;
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  input.outlined:active,
  input.outlined:focus {
    top: 4px;
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
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
    align-items: center;
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
      <span>{backendMessage ? backendMessage : errorMessage}</span>
    </div>
  </div>
</div>
