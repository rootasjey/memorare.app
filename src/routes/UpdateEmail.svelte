<script>
  import { navigate } from 'svelte-routing';

  import {
    client,
    UPDATE_EMAIL_STEP_TWO,
  } from '../data';

  import { show }         from '../components/Snackbar.svelte';
  import SpinnerCheckmark from '../components/SpinnerCheckmark.svelte';

  import { handle }       from '../errors';
  import { settings }     from '../settings';
  import { status }       from '../utils';

  export let emailToken = '';
  let pageStatus = emailToken ? status.loading : status.error;

  verifyEmailToken();

  async function verifyEmailToken() {
    try {
      const response = await client.mutate({
        mutation: UPDATE_EMAIL_STEP_TWO,
        variables: { emailToken },
      });

      pageStatus = status.completed;

      const { email, token } = response.data.updateEmailStepTwo;
      settings.setValue('email', email);

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      handle(error);

      show({
        text: error ? error.message : `Couldn't validate your new email. The token could be wrong.`,
        type: 'error'
      });

      pageStatus = status.error;
    }
  }
</script>

<style>
  .update-email__page {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 20px;
  }

  .illustration {
    margin: 30px 0;
  }
</style>

<div class="update-email__page">
  <h1>Email Verification</h1>
  {#if pageStatus !== status.error}
    <SpinnerCheckmark isCompleted={pageStatus === status.completed}/>
  {/if}

  {#if pageStatus === status.loading}
     <p>Validating your email...</p>
  {:else if pageStatus === status.completed}
     <p>Your email has correctly been updated.</p>
  {:else}
      <svg class="illustration" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-.499-6.296l-1.298 1.296-1.203-1.204 1.298-1.296-1.298-1.296 1.203-1.204 1.298 1.296 1.296-1.296 1.203 1.204-1.297 1.296 1.297 1.296-1.202 1.204-1.297-1.296zm-7 0l-1.298 1.296-1.203-1.204 1.298-1.296-1.298-1.296 1.203-1.204 1.298 1.296 1.296-1.296 1.203 1.204-1.297 1.296 1.297 1.296-1.202 1.204-1.297-1.296z"/>
      </svg>

     <p>We're sorry, there was an issue.</p>

     {#if emailToken.length < 1}
        <span>The email token is empty.</span>
     {/if}
  {/if}
</div>
