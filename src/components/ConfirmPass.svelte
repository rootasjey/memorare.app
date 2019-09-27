<script>
  import { onMount }  from 'svelte';

  export let inputValue   = '';
  export let isValid      = false;
  export let label        = '';     // text displayed on top
  export let placeholder  = '';     // when value is empty
  export let valueToCheck = '';

  $: isValid = (inputValue === valueToCheck) && valueToCheck.length > 0;

  const onChange = () => {
    isValid = (inputValue === valueToCheck) && valueToCheck.length > 0;
  }

  onMount(() => {
    onChange();
  });
</script>

<style>
 label {
    color: #706fd3;
  }

  input {
    margin-bottom: 20px;
    width: 180px;

    border: 0;
    border-bottom: 2px solid #706fd3;

    opacity: .3;
    transition: .3s;
  }

  input:focus {
    opacity: 1;
    border: 0;
    border-bottom: 2px solid #706fd3;
    transition: .3s;
  }

  input:required {
    box-shadow: none;
  }

  .input-container {
    display: flex;
  }

  .check-icon {
    color: #a3cb38;
    font-size: 1.5em;
  }

  .cross-icon {
    color: #f56498;
    font-size: 1.5em;
  }
</style>

<div>
  <label for="input" >{label}</label>

  <div class="input-container">
    <input bind:value={inputValue}
            type="password" name="input" placeholder="{placeholder}" required
            on:change={onChange}>

    {#if isValid}
      <span class="check-icon">&#10003;</span>
    {:else}
      <span class="cross-icon">&#215;</span>
    {/if}
  </div>
</div>
