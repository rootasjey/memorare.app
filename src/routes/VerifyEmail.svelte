<script>
  import { navigate }  from 'svelte-routing';
  import { fly }       from 'svelte/transition';

  import {
    client,
    VERIFY_EMAIL,
    SEND_EMAIL_VERIFICATION
  } from '../data';

  import SpinnerCheck   from '../components/SpinnerCheck.svelte';
  import TextLink       from '../components/TextLink.svelte';
  import { handle }     from '../errors';

  // External props
  export let emailToken = '';

  // Internal props
  let textLinkValue   = 'No email received ?';
  let isSendingEmail  = false;
  let emailSent       = false;
  let isEmailVerified = false;

  // If token is defined, auto-send request and redirect.
  if (emailToken && emailToken.length > 1) {
    onCheckEmail();
  }

  async function onCheckEmail() {
    try {
      const response = await client.mutate({
      mutation: VERIFY_EMAIL,
      variables: { emailToken },
    });

    const { id, name, emailConfig: { isVerified } } = response.data.verifyEmail;

    if (!isVerified) {
      throw new Error(`
        Something went wrong while verifying email.
        Please try again or contact support.`
      )
    }

    isEmailVerified = true;

    // Redirect after 2 sec.
    window.setTimeout(() => navigate('/welcome'), 2000);

    } catch (error) {
      handle(error);
    }
  }

  function onGotoWelcomePage() { navigate('/welcome'); }

  async function onResendEmail() {
    if (emailSent || isSendingEmail) { return; }

    isSendingEmail = true;

    try {
        const response = await client.query({
          query: SEND_EMAIL_VERIFICATION,
        });

        if (response.data.sendEmailVerification) {
          isSendingEmail = false;
          emailSent = true;
          textLinkValue = 'We emailed you a new link ✓';

          return;
        }

        isSendingEmail = false;
        emailSent = false;
        textLinkValue = 'Something went wrong. Try to send a new link again?';

    } catch (error) {
      handle(error);
    }
  }
</script>

<style>
  .icon--centered {
    align-self: center;
  }

  .verify-email {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0 90px;
  }

  .verify-email__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .verify-email--verified {
    display: flex;
    flex-direction: column;

    position: absolute;
  }

  .verify-email__unverified {
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<div class="verify-email">
  {#if isEmailVerified}
    <div class="verify-email--verified" transition:fly={{ y: 20, duration: 500 }}>
      <SpinnerCheck isCompleted={isEmailVerified} />

      <div class="verify-email__content">
        <h1>Your email is now verified :)</h1>
        <span>You'll be redirected in a few moment.</span>
        <TextLink text="Bring me to the welcome page" margin="0" />
      </div>
    </div>
  {:else}
    <div class="verify-email__unverified" transition:fly={{ y: 20, duration: 500 }}>
      <img class="icon--centered" src="/img/mail.png" alt="mail icon" height="128" width="128">

      <div class="verify-email__content">
        <h1>Your account has been successfully created !</h1>
        <p>
          Please click (or copy-paste) the link in the email we send you.
          <br>
          Check your spam folder as sometimes the way is paved with wrong signs.
        </p>

        <TextLink text="{textLinkValue}" margin="0" on:click={onResendEmail} disabled={emailSent} />
      </div>
    </div>
  {/if}
</div>
