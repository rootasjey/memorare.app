<script>
  import Button       from '../components/Button.svelte';
  import ConfirmPass  from '../components/ConfirmPass.svelte';
  import Dialog       from '../components/Dialog.svelte';
  import Input        from '../components/Input.svelte';
  import Select       from '../components/Select.svelte';
  import { show }     from '../components/Snackbar.svelte';
  import TextLink     from '../components/TextLink.svelte';

  import {
    client,
    UPDATE_EMAIL_STEP_ONE,
    UPDATE_LANG,
    UPDATE_NAME,
    UPDATE_PASSWORD,
  } from '../data';

  import { handle }   from '../errors';
  import { settings } from '../settings';

  let email               = settings.getValue('email');
  let lang                = settings.getValue('lang');
  let name                = settings.getValue('name');

  let initialEmail        = email;
  let initialLang         = lang;
  let initialName         = name;

  let oldPassword         = '';
  let newPassword         = '';
  let confirmNewPassword  = '';

  let defaultLabel = lang ? lang.toUpperCase() : '';
  let showPasswordDialog = false;
  let emailSent = false;

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  $: isInitialName = name === initialName;
  $: isInitialEmail = email === initialEmail;

  async function updateEmail() {
    try {
      const response = await client.mutate({
        mutation: UPDATE_EMAIL_STEP_ONE,
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

  function onClickUpdatePassword() {
    showPasswordDialog = true;
  }

  function onSelectLang(item) {
    const { value } = item;

    if (value === initialLang) { return; }

    lang = value;
    updateLang();
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

  .input-container {
    display: flex;
    flex-direction: column;

    margin: 20px 0;
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
    margin: 20px 0;
  }

  .row {
    display: flex;
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
            <TextLink text="Re-send" color="#6ab04c" fontSize="1.1em" />
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
        <Button value="Delete my account" secondary={true} />
      </div>
    </div>
  </div>

  <Dialog bind:active={showPasswordDialog} maxWidth={350}>
    <div slot="content" class="password-dialog-content">
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
          bind:inputValue={confirmNewPassword} valueToCheck={newPassword}
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
</div>