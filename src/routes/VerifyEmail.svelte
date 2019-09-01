<script>
  import queryString from 'query-string';
  import { query } from 'svelte-apollo';
  import { client, SEND_EMAIL_VERIFICATION } from '../data';

  import TextLink from '../components/TextLink.svelte';

  // External props
  export let tokenid = '';

  // Internal props
  let textLinkValue = 'No email received ?';
  let isSendingEmail = false;
  let emailSent = false;

  let queryParams = queryString.parse(tokenid);
  const { id, token } = queryParams;

  if (id && token) { // If token is defined, auto-send request and redirect.
    console.log('auto-send request for email verification...')
  }

  const sendEmailQuery = query(client, {
    query: SEND_EMAIL_VERIFICATION,
    variables: { userId: id },
  });

  const onResendEmail = () => {
    if (emailSent || isSendingEmail) { return; }

    isSendingEmail = true;
    console.log('resend email...');

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
      })
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
</style>

<div class="verify-email">
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
