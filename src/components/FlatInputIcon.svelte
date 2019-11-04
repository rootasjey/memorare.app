<script>
  export let value = '';
  export let placeholder = '';

  let bigText = false;
  let focused = false;

  function _onFocus() {
    focused = true;
  }

  function _onBlur() {
    focused = false;
  }
</script>

<style>
  .input-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  input[type="text"] {
    height: 50px;
    padding: 25px;

    border: 0;
    border: 3px solid transparent;
    border-radius: 5px;

    color: #fff;
    background-color: transparent;
    text-align: center;
    text-overflow: ellipsis;

    transition: .3s;
  }

  input[type="text"]:hover {
    transform: translateY(1px);
    transition: .3s;
  }

  input:focus {
    border: 3px solid rgba(0,0,0,0.5);
    transition: .3s;
  }

  input[type="text"]::placeholder {
    color: #eee;
  }

  input.bigText[type="text"] {
    font-size: 2em;
    font-weight: 700;
  }

  .icon {
    margin-right: 10px;

    position: relative;
    top: -4px;
    left: 10px;

    transition: .3s;
  }

  .focused .icon {
    left: 0;
    transition: .3s;
  }
</style>

<div class="input-icon"class:focused>
  <div class="icon">
    <slot name="icon"></slot>
  </div>

  <input type="text"
    class:bigText
    bind:value="{value}"
    placeholder="{placeholder}"
    on:focus={_onFocus}
    on:blur={_onBlur}>
</div>
