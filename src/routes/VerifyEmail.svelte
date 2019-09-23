<script>
  import queryString        from 'query-string';
  import { query, mutate }  from 'svelte-apollo';
  import { navigate }       from 'svelte-routing';
  import { fly }            from 'svelte/transition';

  import {
    client,
    CHECK_EMAIL,
    SEND_EMAIL_VERIFICATION
  } from '../data';

  import SpinnerCheckmark from '../components/SpinnerCheckmark.svelte';
  import TextLink from '../components/TextLink.svelte';

  // External props
  export let tokenid = '';

  // Internal props
  let textLinkValue   = 'No email received ?';
  let isSendingEmail  = false;
  let emailSent       = false;
  let isEmailVerified = false;

  let queryParams = queryString.parse(tokenid);
  const { id, token } = queryParams;


  const onCheckEmail = async (pId = '', pToken = '') => {
    const response = await mutate(client, {
      mutation: CHECK_EMAIL,
      variables: { userId: pId, token: pToken },
    });

    const { _id, name } = response.data.checkEmail;

    if (!response.data.checkEmail.emailConfig.isVerified) {
      throw new Error('Something went wrong while verifying email. Please try again or contact support.')
    }

    isEmailVerified = true;

    // Redirect after 2 sec.
    window.setTimeout(() => navigate('/welcome'), 2000);
  }

  if (id && token) { // If token is defined, auto-send request and redirect.
    onCheckEmail(id, token).catch((reason) => console.error(reason));
  }

  const sendEmailQuery = query(client, {
    query: SEND_EMAIL_VERIFICATION,
    variables: { userId: id },
  });

  const onGotoWelcomePage = () => navigate('/welcome');

  const onResendEmail = () => {
    if (emailSent || isSendingEmail) { return; }

    isSendingEmail = true;

    sendEmailQuery.result()
      .then((response) => {
        isSendingEmail = false;
        emailSent = true;
        textLinkValue = 'We emailed you a new link ✓';
      })
      .catch((reason) => {
        isSendingEmail = false;
        emailSent = false;
        textLinkValue = 'Something went wrong. Try to send a new link again?';
      });
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

  .verify-email--unverified {
    position: absolute;
  }
</style>

<div class="verify-email">
  {#if isEmailVerified}
    <div class="verify-email--verified" transition:fly={{ y: 20, duration: 500 }}>
      <SpinnerCheckmark isCompleted={isEmailVerified} />

      <div class="verify-email__content">
        <h1>Your email is now verified :)</h1>
        <span>You'll be redirected in a few moment.</span>
        <TextLink text="Bring me to the welcome page" margin="0" />
      </div>
    </div>
  {:else}
    <div class="verify-email--unverified" transition:fly={{ y: 20, duration: 500 }}>
      <img class="icon--centered" src="/img/mail.png" alt="mail icon" height="128" width="128">

      <div class="verify-email__content">
        <h1>Your account has been successfully created !</h1>
        <p>
          Please click (or copy-paste) the link in the email we send you.
          <br>
          Check your spam folder as sometimes the way is paved with wrong signs.
        </p>

        <TextLink text="{textLinkValue}" margin="0" onClick={onResendEmail} disabled={emailSent} />
      </div>
    </div>
  {/if}
</div>
