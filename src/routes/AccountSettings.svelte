<script>
  import { navigate }       from 'svelte-routing';

  import Button             from '../components/Button.svelte';
  import ConfirmPass        from '../components/ConfirmPass.svelte';
  import Dialog             from '../components/Dialog.svelte';
  import Input              from '../components/Input.svelte';
  import Select             from '../components/Select.svelte';
  import SpinnerCheckmark   from '../components/SpinnerCheckmark.svelte';
  import { show }           from '../components/Snackbar.svelte';
  import TextLink           from '../components/TextLink.svelte';
  import { status }         from '../utils';

  import {
    client,
    DELETE_ACCOUNT,
    UPDATE_EMAIL_STEP_ONE,
    UPDATE_LANG,
    UPDATE_NAME,
    UPDATE_PASSWORD,
  } from '../data';

  import { handle }   from '../errors';

  import {
    isUserAuthenticated,
    logout,
    settings,
  } from '../settings';

  if (!$isUserAuthenticated) {
    setTimeout(() => {
      navigate('/signin');
    }, 500);
  }

  // Inputs value
  let email               = settings.getValue('email');
  let lang                = settings.getValue('lang');
  let name                = settings.getValue('name');

  let initialEmail        = email;
  let initialLang         = lang;
  let initialName         = name;

  let oldPassword         = '';
  let newPassword         = '';
  let confirmNewPassword  = '';
  // -------------
  let defaultLabel        = lang ? lang.toUpperCase() : '';
  let delUserStatus       = status.idle;
  let emailSent           = false;
  let showPasswordDialog  = false;
  let showDelUserDialog   = false;
  let passConfirmDelUser  = '';
  let domPassDialog;

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  $: isInitialName = name === initialName;
  $: isInitialEmail = email === initialEmail;

  async function updateEmail() {
    try {
      const response = await client.query({
        query: UPDATE_EMAIL_STEP_ONE,
        variables: { newEmail: email },
      });

      if (response.data.updateEmailStepOne) {
        show({ text: 'Please click on the link inside the email sent.' });

        emailSent = true;
        initialEmail = email;
      }

    } catch (error) {
      handle(error);
    }
  }

  async function updateLang() {
    try {
      const response = await client.mutate({
        mutation: UPDATE_LANG,
        variables: { lang },
      });

      const { lang: userLang } = response.data.updateLang;

      settings.setValue('lang', userLang);
      show({ text: 'Your new language has been saved.', type: 'success' });

    } catch (error) {
      handle(error);
      show({
        text: error.message ? error.message : "Sorry, could not save your new language.",
        type: error,
      });
    }
  }

  async function updateName() {
    try {
      const response = await client.mutate({
        mutation: UPDATE_NAME,
        variables: { name },
      });

      const { name: userName } = response.data.updateName;

      settings.setValue('name', userName);
      initialName = userName;

      show({ text: 'Your name has been updated.', type: 'success' });

    } catch (error) {
      handle(error);

      show({
        text: error.message ? error.message : 'Sorry, could not save your new name.',
        type: 'error',
      });
    }
  }

  async function updatePassword() {
    showPasswordDialog = false

    try {
      const response  = await client.mutate({
        mutation: UPDATE_PASSWORD,
        variables: { oldPassword, newPassword },
      });

      const { token } = response.data.updatePassword;
      settings.setValue('token', token);

      show({ text: 'Your password has been updated.', type: 'success' });

    } catch (error) {
      handle(error);
    }
  }

  async function deleteAccount() {
    delUserStatus = status.loading;

    try {
      const response = await client.mutate({
        mutation: DELETE_ACCOUNT,
        variables: { password: passConfirmDelUser },
      });

      delUserStatus = status.completed;
      logout({ delay: 60000 });

    } catch (error) {
      handle(error);
      delUserStatus = status.error;
    }
  }

  function onClickUpdatePassword() {
    showPasswordDialog = true;
  }

  function onSelectLang(item) {
    const { value } = item;

    if (value === initialLang) { return; }

    lang = value;
    updateLang();
  }

  function onResendEmail() {
    updateEmail();
  }

  function onEnterValidateDeleteAccount() {
    deleteAccount();
  }

  function onEnterValidateUpdatePassword() {
    updatePassword();
  }

  function onEnterNextInput (event) {
    const { target } = event;
    const inputs = domPassDialog.querySelectorAll('input');

    let indexMatch;

    Array
      .from(inputs)
      .some((input, index) => {
        if (input === target) {
          indexMatch = index;
          return true;
        }

        return false;
    });

    if (indexMatch >= inputs.length) { return; }

    const nextInput = inputs[indexMatch + 1];
    if (!nextInput || !nextInput.focus) { return; }

    nextInput.focus();
  }

</script>

<style>
  .account-settings__page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .account-settings__content {
    margin-top: 30px;
    width: 350px;
  }

  .delete-account-dialog__body {
    margin: 40px 0 80px 0;
  }

  .delete-account-dialog__body .input-container {
    margin-top: 50px;
  }

  .delete-account-dialog-content {
    max-width: 500px;
  }

  .delete-account-dialog-content header h1 {
    margin: 0;
  }

  .delete-account-dialog-content footer {
    display: flex;
    justify-content: flex-end;
  }

  .delete-account-dialog__body--centered {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-container {
    display: flex;
    flex-direction: column;

    margin: 20px 0;
  }

  .header--centered {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 30px;
  }

  .label {
    color: #fff;
    background-color: #706fd3;
    align-self: flex-start;
    margin-bottom: 10px;
    padding: 5px 10px;

    border: 1px solid #706fd3;
    border-radius: 5px;

    text-transform: uppercase;
  }

  .password-dialog-content {
    padding: 20px;
  }

  .password-dialog-content > header {
    margin-bottom: 40px;
  }

  .row-reverse {
    display: flex;
    flex-direction: row-reverse;
  }

  .row {
    display: flex;
  }

  .sub-header {
    font-weight: bold;
    text-transform: uppercase;
  }

  .sub-text {
    color: rgba(0,0,0,0.5);
    font-size: .9em;
    margin-bottom: 10px;
  }
</style>

<div class="account-settings__page">
  <header>
    <h1>Account Settings</h1>
    <span>You can change your preferences here.</span>
  </header>

  <div class="account-settings__content">
    <div class="user-info">
      <div class="input-container">
        <span class="label">Name</span>
        <div class="row">
          <Input type="name"
            outlined={true}
            bind:inputValue={name} checkValue={true}
            errorMessage="Your name contains invalid characters. Only letters, numbers, underscores and hypens allowed." />

          <Button
            value="Save"
            hide={isInitialName}
            onClick={updateName}
            width={50} height={10} margin="0 0 0 20px"/>
        </div>
      </div>

      <div class="input-container">
        <span class="label">Email</span>
        <div class="row">
          <Input type="email"
            outlined={true}
            bind:inputValue={email} checkValue={true}
            errorMessage="The value entered is not an email." />

          <Button
              value="Save"
              hide={isInitialEmail}
              onClick={updateEmail}
              width={50} height={10} margin="0 0 0 20px" />
        </div>

        {#if emailSent}
          <span class="sub-text" >
            We've sent you an email. Click on the link inside the email to confirm the change.
            Check your spam folder if you don't see the email in your INBOX.
            <TextLink text="Re-send" color="#6ab04c" fontSize="1.1em" onClick={onResendEmail} />
          </span>
        {/if}
      </div>

      <div class="select-container">
        <span class="label">Language</span>
        <Select
          defaultLabel={defaultLabel}
          items={selectItems}
          onClickItem={onSelectLang} />
      </div>

      <div class="input-container">
        <Button value="Change password" onClick={onClickUpdatePassword} />
      </div>

      <div class="input-container">
        <Button value="Delete my account" secondary={true} onClick={() => showDelUserDialog = true} />
      </div>
    </div>
  </div>

  <Dialog bind:active={showPasswordDialog} maxWidth={350}>
    <div slot="content" bind:this={domPassDialog} class="password-dialog-content">
      <header>
        <h1>Update password</h1>
        <p>Please confirm your changes by entering your old and new passwords.</p>
      </header>

      <div>
        <span class="label">OLD PASSWORD</span>
        <Input type="password" placeholder="********"
          outlined={true}
          errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
          bind:inputValue={oldPassword}
          checkValue={true}
          margin="10px 0"
        />
      </div>

      <div>
        <span class="label">NEW PASSWORD</span>
        <Input type="password" placeholder="********"
          outlined={true}
          errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
          bind:inputValue={newPassword}
          checkValue={true}
          margin="10px 0"
        />
      </div>

      <div>
        <span class="label">CONFIRM NEW PASSWORD</span>
        <ConfirmPass
          placeholder="********"
          outlined={true}
          margin="10px 0"
          bind:inputValue={confirmNewPassword}
          valueToCheck={newPassword}
          onEnter={onEnterValidateUpdatePassword}
          errorMessage="This value doesn't match the previous entered password."
        />
      </div>

      <div class="row-reverse">
        <Button
        value="Confirm"
        onClick={updatePassword}/>

        <Button
          value="Cancel"
          margin="0 10px"
          secondary={true}
          onClick={() => showPasswordDialog = false }/>
      </div>
    </div>
  </Dialog>

  <Dialog bind:active={showDelUserDialog} fullSize={true}>
    <div slot="content" class="delete-account-dialog-content">
      {#if delUserStatus === status.idle}
        <header>
          <span class="sub-header">Delete account</span>
          <h1>Are you sure?</h1>
        </header>

        <div class="delete-account-dialog__body">
          <span>The following actions will be completed:</span>

          <ul>
            <li>This action is irreversible and you won't be able to login back</li>
            <li>All you lists and favorites will be deleted</li>
            <li>Your quotes will stay and won't be deleted but they will be disassociated with your account</li>
          </ul>

          <div class="input-container">
            <span class="label">Current password</span>
            <Input
              bind:inputValue={passConfirmDelUser}
              type="password"
              placeholder="My Awesomee Password"
              onEnter={onEnterValidateDeleteAccount}
              outlined={true} />
          </div>
        </div>

        <footer>
          <Button value="Cancel" margin="0 10px" onClick={() => showDelUserDialog = false} />
          <Button value="Delete" secondary={true} onClick={deleteAccount} />
        </footer>
      {:else if delUserStatus === status.error}
        <header>
          <span class="sub-header">Delete account</span>
          <h1>Everything didn't go as expected.</h1>
        </header>

        <div class="delete-account-dialog__body">
          <p>
            Sorry for the inconvenience. Please close this dialog and try again.
          </p>
        </div>
      {:else}
        <header class="header--centered">
          <span class="sub-header">Delete account</span>

          {#if delUserStatus === status.completed}
            <h1>Good Bye!</h1>
          {:else}
            <h1>Deleting data through the space and time...</h1>
          {/if}
        </header>

        <div class="delete-account-dialog__body--centered">
          <SpinnerCheckmark isCompleted={delUserStatus === status.completed} />

          {#if delUserStatus === status.completed}
            <p>
              Your account has been successfully deleted. <br>
              We hope we'll see each other one day ;)
            </p>
          {/if}
        </div>
      {/if}

    </div>
  </Dialog>
</div>
