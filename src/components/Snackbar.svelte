<script context="module">
  import { writable } from 'svelte/store';

  let messagesQueue = [
    // {
    //   text: '',
    //   actions: [
    //     {
    //       text: 'button 1',
    //       handler: () => {},
    //     },
    //     {
    //       text: 'button 2',
    //       handler: () => {},
    //     },
    //   ]
    // }
  ];

  const observableMessageQueue = writable(messagesQueue);

  export function show(messageConfig = {}) {
    if (typeof messageConfig !== 'object') {
      throw new Error(`Expected an object but received ${typeof messageConfig}.`);
    }

    if (!messageConfig.text) { throw new Error(`Expected a text message but none was provided.`); }

    messagesQueue.push(messageConfig);
    observableMessageQueue.set(messagesQueue);
  }
</script>

<script>
  import { fly } from 'svelte/transition';

  let isActionsActive = false;
  let isAction1Active = false;
  let isAction2Active = false;

  let action1Fct = () => {};
  let action2Fct = () => {};

  let messageDuration = 4000;
  let isMessageVisible = false;
  let messageText = ''
  let action1Text = '';
  let action2Text = '';

  let firstTimer; // setTimeout ref.
  let secondTimer; // second setTimout ref.
  let currentMsg;

  const unsubscrbe = observableMessageQueue.subscribe((messagesArray) => {
    if (isMessageVisible) { return; } // wait for the previous message to go away.
    if (messagesQueue.length < 1) { return; }

    currentMsg = messagesQueue[0];
    messageText = currentMsg.text;

    if (currentMsg.actions && currentMsg.actions.length > 0) {
      isActionsActive = true;

      const action1 = currentMsg.actions[0];
      action1Fct      = action1.handler ? action1.handler : () => {};
      action1Text     = action1.text;
      isAction1Active = true;

      if (currentMsg.actions.length > 1) {
        const action2 = currentMsg.actions[0];
        action2Fct      = action2.handler ? action2.handler : () => {};
        action2Text     = action2.text;
        isAction2Active = true;
      }

    } else {
      isActionsActive = false;
      isAction1Active = false;
      isAction2Active = false;
      action1Fct      = () => {};
      action1Text     = '';
      action2Fct      = () => {};
      action2Text     = '';
    }

    isMessageVisible = true;

    firstTimer = window.setTimeout(() => {
      isMessageVisible = false;

      secondTimer = window.setTimeout(() => {
        messagesQueue = messagesQueue.filter((msg) => msg !== currentMsg);
        currentMsg = undefined;
        observableMessageQueue.set(messagesQueue);

      }, 1000);
    }, messageDuration);
  });

  function onDismissMessage() {
    isMessageVisible = false;
    window.clearTimeout(firstTimer);
    window.clearTimeout(secondTimer);

    window.setTimeout(() => {
      messagesQueue = messagesQueue.filter((msg) => msg !== currentMsg);
      currentMsg = undefined;
      observableMessageQueue.set(messagesQueue);
    }, 1000);
  }
</script>

<style>
  .snackbar-container {
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;

    pointer-events: none;
  }

  .snackbar {
    color: white;
    background-color: #353b48;

    display: flex;

    padding: 20px;
    margin: 10px;

    position: absolute;
    right: 20px;
    top: 20px;

    border-radius: 5px;
    min-width: 200px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .snackbar__message {
    margin-right: 10px;
  }

  .snackbar__actions {
    display: flex;
  }

  .snackbar__action {
    color: #f56498;
    cursor: pointer;
    transition: .3s;
  }

  .snackbar__action:hover {
    color: #f56499bd;
    transition: .3s;
  }

  .snackbar__action1 {
    margin-right: 10px;
  }

</style>

<div class="snackbar-container">
  {#if isMessageVisible}
    <div class="snackbar" transition:fly={{ y: 10, duration: 500 }} on:click={onDismissMessage} >
      <div class="snackbar__message">
        {messageText}
      </div>
      {#if isActionsActive}
        <div class="snackbar__actions">
          {#if isAction1Active}
            <div class="snackbar__action snackbar__action1" on:click={action1Fct}>{action1Text}</div>
          {/if}

          {#if isAction2Active}
            <div class="snackbar__action snackbar__action2" on:click={action2Fct}>{action2Text}</div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
