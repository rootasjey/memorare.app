<script>
  import { onMount }  from 'svelte';

  export let errorMessage = '';
  export let inputValue   = '';
  export let isValid      = false;
  export let label        = '';
  export let margin       = '';
  export let onEnter      = () => {};
  export let outlined     = false;
  export let placeholder  = '';
  export let valueToCheck = '';

  let isDirty = false;

  $: isValid = (inputValue === valueToCheck) && valueToCheck.length > 0;
  $: marginCSS = margin ? `margin: ${margin};` : '';
  $: styles = `${marginCSS}`;

  const onChange = () => {
    isDirty = true;
    isValid = (inputValue === valueToCheck) && valueToCheck.length > 0;
  }

  const onKeyUp = (event) => {
    const reEnter = /Enter/ig;

    if (reEnter.test(event.code)) {
      onEnter(event);
    }
  }

  onMount(() => {
    if (!inputValue) { return; }
    onChange();
  });
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

  .input-container {
    width: 100%;
  }

  input {
    margin-bottom: 20px;
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

  .input-interactions {
    display: flex;
    flex-direction: column;
  }

  label {
    color: #706fd3;
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
      <input bind:value={inputValue}
            class:outlined
            type="password" name="input"
            placeholder="{placeholder}"
            required
            style="{styles}"
            on:keyup={onKeyUp}
            on:change={onChange}>

      {#if isDirty}
        {#if isValid}
          <span class="check-icon">&#10003;</span>
        {:else}
          <span class="cross-icon">&#215;</span>
        {/if}
      {/if}
    </div>

    <div class="error-message" class:visible={!isValid && isDirty}>
      <span>{errorMessage}</span>
    </div>
  </div>
</div>
