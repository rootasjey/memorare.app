<script>
  import { navigate } from 'svelte-routing';

  import RectButton   from '../components/RectButton.svelte';
  import CapHeader    from '../components/CapHeader.svelte';
  import ConfirmPass  from '../components/ConfirmPass.svelte';
  import Input        from '../components/Input.svelte';
  import Label        from '../components/Label.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import SpinnerCheck from '../components/SpinnerCheck.svelte';
  import TextLink     from '../components/TextLink.svelte';

  import {
    client,
    FORGET_PASSWORD_STEP_ONE,
    FORGET_PASSWORD_STEP_TWO,
  } from '../data';

  import { handle }   from '../errors';
  import { settings } from '../settings';
  import { onEnterNextInput, status }   from '../utils';

  // Exterinal Props.
  export let emailToken = '';

  // Internal Props.
  let email           = '';
  let password        = '';
  let confirmPassowrd = '';
  let pageStatus      = status.idle;
  let domPasswords;

  async function sendForgetEmail() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: FORGET_PASSWORD_STEP_ONE,
        variables: { email },
        fetchPolicy: 'network-only',
      });

      if (response.data.forgetPasswordStepOne) {
        pageStatus = status.completed;

        show({
          text: `An email has been sent.`,
          type: 'success',
        })

        return;
      }

      pageStatus = status.error;

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }

  async function chooseNewPassword() {
    if (password !== confirmPassowrd) {
      show({
        text: `Your passwords don't match`,
        type: 'error',
      });

      return;

    } else if (password.length === 0) {
      show({
        text: `Your password cannot be empty`,
        type: 'error',
      });

      return;
    }

    pageStatus = status.loading;

    try {
      const response = await client.mutate({
        mutation: FORGET_PASSWORD_STEP_TWO,
        variables: { newPassword: password, emailToken },
      });

      const { token } = response.data.forgetPasswordStepTwo;
      settings.setValue('token', token);

      pageStatus = status.completed;

      show({
        text: `Your password has successfully been updated`,
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  }

  function onRefresh() {
    location.reload(true);
  }
</script>

<style>
  .forget-password__page {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 70px;
    width: 400px;
    margin: auto;
  }

  .choose-new-password__body {
    width: 400px;
  }

  .idle-container {
    display: flex;
    flex-direction: column;
  }

  footer {
    align-self: flex-end;
  }

  .row {
    display: flex;
    margin-top: 40px;
  }

  .flex-centered {
    display: flex;
    flex-direction: column;

    padding: 40px 0;
  }

  .sub-title {
    opacity: .7;
  }

  .marged {
    margin: 20px 0;
  }
</style>

<div class="forget-password__page">
  {#if !emailToken}
    <div class="forget-password__body">
      {#if pageStatus === status.idle}
        <div class="idle-container">
          <CapHeader caption="Forget Password" title="We'll send you an email to reset your password" />

          <div class="marged">
            <Label value="email" />
            <Input type="email"
              margin="10px 0 0 0"
              outlined={true}
              bind:inputValue={email}
              checkValue={true}
              noBackCheck={true}
              placeholder="My Awesome email"
              errorMessage="The value entered is not an email."
              on:enter={sendForgetEmail}
            />
          </div>

          <footer>
            <RectButton value="Send me an email" on:click={sendForgetEmail} />
          </footer>
        </div>
      {:else if pageStatus === status.loading}
        <div class="flex-centered">
          <SpinnerCheck isCompleted={pageStatus !== status.loading} />
          <h3 class="sub-title">Sending you the email...</h3>
        </div>
      {:else if pageStatus === status.completed}
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="#78e08f" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
          </svg>
        </div>

        <CapHeader caption="Forget Password" title="We have sent you an email" />

        <div>
          <span>If the email address you entered is valid, you should soon receive a message in your inbox.</span>
          <p>Look into your spam folder if nothing comes in your inbox.</p>
          <TextLink text="Re-send email" onClick={sendForgetEmail}/>
        </div>
      {:else}
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="#f56498" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"/>
          </svg>
        </div>

        <CapHeader caption="Forget Password" title="Something unexpected happenned" />

        <div>
          <span>An error occurred and we couldn't send you the email...</span><br>
          <span>Please refresh the page and try again</span>
        </div>

        <TextLink text="Refresh" fontSize="1em" margin="10px 0" onClick={onRefresh}/>
      {/if}
    </div>
  {:else}
    {#if pageStatus === status.idle}
      <div class="choose-new-password__body">
        <CapHeader caption="Forget Password" title="Choose a new password" />

        <div class="flex-centered" bind:this={domPasswords}>
          <div>
            <Label value="NEW PASSWORD" />
            <Input type="password" placeholder="********"
              outlined={true}
              errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
              bind:inputValue={password}
              checkValue={true}
              margin="10px 0"
              on:enter={(event) => onEnterNextInput(event, domPasswords)}
            />
          </div>

          <div>
            <Label value="CONFIRM NEW PASSWORD" />
            <ConfirmPass
              placeholder="********"
              outlined={true}
              margin="10px 0"
              bind:inputValue={confirmPassowrd}
              valueToCheck={password}
              on:enter={chooseNewPassword}
              errorMessage="This value doesn't match the previous entered password."
            />
          </div>

          <footer class="row">
            <RectButton value="Cancel"
              secondary={true}
              margin="0 10px"
              on:click={() => navigate('/')}
            />
            <RectButton value="Confirm" onC:cick={chooseNewPassword} />
          </footer>
        </div>
      </div>
    {:else if pageStatus === status.loading}
      <div class="flex-centered">
        <SpinnerCheck isCompleted={pageStatus !== status.loading} />
        <h3 class="sub-title">Updating your new password...</h3>
      </div>
    {:else if pageStatus === status.completed}
      <div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="#78e08f" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
          </svg>
        </div>

        <CapHeader caption="Reset Password" title="Your new password has been set" />

        <div>
          <p>You can now connect with your new password.</p>
          <TextLink text="Go to login page" onClick={() => navigate('/signin')}/>
        </div>
      </div>
    {:else}
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="#f56498" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"/>
        </svg>

        <CapHeader caption="Forget Password" title="Something unexpected happenned" />

        <div>
          <span>There was an unexpected error while updating your new password.</span><br>
          <span>Please refresh the page and try again or contact the support.</span>
        </div>

        <TextLink text="Refresh" fontSize="1em" margin="10px 0" onClick={onRefresh}/>
      </div>
    {/if}

  {/if}
</div>
