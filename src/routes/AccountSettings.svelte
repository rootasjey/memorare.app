<script>
  import { navigate }   from 'svelte-routing';

  import { primary }    from '../colors';

  import CapHeader      from '../components/CapHeader.svelte';
  import ConfirmPass    from '../components/ConfirmPass.svelte';
  import Dialog         from '../components/Dialog.svelte';
  import FlatInputIcon  from '../components/FlatInputIcon.svelte';
  import Input          from '../components/Input.svelte';
  import RectButton     from '../components/RectButton.svelte';
  import Select         from '../components/Select.svelte';
  import SpinnerCheck   from '../components/SpinnerCheck.svelte';
  import { show }       from '../components/Snackbar.svelte';
  import TextLink       from '../components/TextLink.svelte';

  import { onEnterNextInput, status }     from '../utils';

  import {
    client,
    DELETE_ACCOUNT,
    UPDATE_EMAIL_STEP_ONE,
    UPDATE_IMG_URL,
    UPDATE_LANG,
    UPDATE_NAME,
    UPDATE_PASSWORD,
  } from '../data';

  import { handle } from '../errors';

  import {
    getUserAvatar,
    isUserAuthenticated,
    isAvatarUpdated,
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
  let domDelUserDialog;
  let domPassDialog;
  let domAvatarDialog;
  let emailSent           = false;
  let isImgUrlDialogActive = false;
  let passConfirmDelUser  = '';
  let showDelUserDialog   = false;
  let showPasswordDialog  = false;

  const selectItems = [
    { label: 'EN', value: 'en' },
    { label: 'FR', value: 'fr' },
  ];

  let userAvatarImg = `background-image: url("${getUserAvatar('large')}");`;
  let newUserAvatarUrl = settings.getValue('imgUrl') ? settings.getValue('imgUrl') : '';

  $: isInitialName = name === initialName;
  $: isInitialEmail = email === initialEmail;

  async function onUpdateEmail() {
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

      initialLang = userLang;
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

  async function onUpdateName() {
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
      logout({ delay: 5000 });

    } catch (error) {
      handle(error);
      delUserStatus = status.error;
    }
  }

  function onOpenDelAccountDialog() {
    showDelUserDialog = true;

    setTimeout(() => {
      const input = domDelUserDialog.querySelector('input');
      if (input) { input.focus(); }
    }, 500);
  }

  function onOpenPassDialog() {
    showPasswordDialog = true;

    setTimeout(() => {
      const input = domPassDialog.querySelector('input');
      if (input) { input.focus(); }
    }, 500);
  }

  function onSelectLang(event) {
    const { activeItem } = event.detail;
    const { value } = activeItem;

    if (value === initialLang) { return; }

    lang = value;
    updateLang();
  }

  function onResendEmail() {
    onUpdateEmail();
  }

  function onEnterValidateDeleteAccount() {
    deleteAccount();
  }

  function onEnterValidateUpdatePassword() {
    updatePassword();
  }

  function onOpenImgUrlDialog() {
    isImgUrlDialogActive = true;

    // NOTE: There's a bug after a save
    // input disapear until focused again
    setTimeout(() => {
      let input = domAvatarDialog.querySelector('input');
      if (input) { input.focus(); }
    }, 500);
  }

  async function onSaveImgUrl() {
    isImgUrlDialogActive = false;

    try {
      const response = await client.mutate({
        mutation: UPDATE_IMG_URL,
        variables: { imgUrl: newUserAvatarUrl },
      });

      const { imgUrl } = response.data.updateImgUrl;

      settings.setValue('imgUrl', imgUrl);
      userAvatarImg = `background-image: url("${getUserAvatar('large')}");`;
      isAvatarUpdated.update(n => n + 1); // Notify changes

      show({
        text: `Your avatar has been successfully updated.`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  function onCancelEditImgUrl() {
    isImgUrlDialogActive = false;
    newUserAvatarUrl = settings.getValue('imgUrl');
  }
</script>

<style>
  .account-settings__page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .account-settings__page > header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .account-settings__content {
    margin-top: 30px;
    width: 350px;
  }

  .buttons-row {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }

  .buttons-list {
    display: flex;
    flex-direction: column;

    margin: 50px 0;
    margin-bottom: 100px;
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

  .edit-avatar-dialog-content {
    color: #fff;
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

    text-transform: uppercase;
  }

  .password-dialog-content {
    padding: 20px;
  }

  .password-dialog-content > header {
    margin-bottom: 40px;
  }

  .dialog-footer {
    display: flex;
    flex-direction: row-reverse;

    margin: 30px 0;
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

  .user-avatar {
    width: 200px;
    height: 200px;

    align-self: center;
    margin: 40px 0;

    background-color: #f56498;
    cursor: pointer;

    position: relative;
    top: 0;
    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:hover {
    position: relative;
    top: 2px;
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:hover .user-avatar__bg {
    opacity: .5;
  }

  .user-avatar:active {
    position: relative;
    top: 4px;
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:active .user-avatar__bg {
    opacity: .9;
  }

  .user-avatar__img {
    width: 100%;
    height: 100%;

    background-repeat: no-repeat;
    background-size: cover;

    position: absolute;
    top: 0;
  }

  .user-avatar__bg {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0,0,0,0.5);

    position: absolute;
    top: 0;

    opacity: 0;
    transition: .3s;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="account-settings__page">
  <header>
    <h1>Account Settings</h1>
    <span>You can change your preferences here.</span>
  </header>

  <div class="account-settings__content">
    <div class="user-info">
      <div class="user-avatar" on:click={onOpenImgUrlDialog}>
        <div class="user-avatar__img" style="{userAvatarImg}"></div>
        <div class="user-avatar__bg">
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="#fff" viewBox="0 0 24 24"><path d="M1.439 16.873l-1.439 7.127 7.128-1.437 16.873-16.872-5.69-5.69-16.872 16.872zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zm15.031-15.032l-13.617 13.618-2.86-2.861 10.825-10.826 2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"/></svg>
        </div>
      </div>

      <div class="input-container">
        <span class="label">Name</span>
        <div class="row">
          <Input type="name"
            outlined={true}
            height="50px"
            bind:inputValue={name}
            checkValue={true}
            on:enter={onUpdateName}
            errorMessage="Your name contains invalid characters. Only letters, numbers, underscores and hypens allowed." />

          <RectButton
            value="Save"
            hide={isInitialName}
            on:click={onUpdateName}
            margin="4px 0 0 20px" />
        </div>
      </div>

      <div class="input-container">
        <span class="label">Email</span>
        <div class="row">
          <Input type="email"
            outlined={true}
            height="50px"
            bind:inputValue={email}
            checkValue={true}
            on:enter={onUpdateEmail}
            errorMessage="The value entered is not an email." />

          <RectButton
            value="Save"
            hide={isInitialEmail}
            on:click={onUpdateEmail}
            margin="4px 0 0 20px" />
        </div>

        {#if emailSent}
          <span class="sub-text" >
            We've sent you an email. Click on the link inside the email to confirm the change.
            Check your spam folder if you don't see the email in your INBOX.
            <TextLink text="Re-send" color="#6ab04c" fontSize="1.1em" on:click={onResendEmail} />
          </span>
        {/if}
      </div>

      <div class="select-container">
        <span class="label">Language</span>
        <Select
          defaultLabel={defaultLabel}
          items={selectItems}
          on:clickitem={onSelectLang} />
      </div>

      <div class="buttons-list">
        <RectButton value="Change password" on:click={onOpenPassDialog} />
        <RectButton value="Delete my account" secondary={true} on:click={onOpenDelAccountDialog} />
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
          on:enter={(event) => onEnterNextInput(event, domPassDialog)}
          margin="10px 0" />
      </div>

      <div>
        <span class="label">NEW PASSWORD</span>
        <Input type="password" placeholder="********"
          outlined={true}
          errorMessage="Your password must be at least 8 characters length and must contain at least one uppercase letter, one lowercase letter, and one number."
          bind:inputValue={newPassword}
          checkValue={true}
          on:enter={(event) => onEnterNextInput(event, domPassDialog)}
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
          on:enter={onEnterValidateUpdatePassword}
          errorMessage="This value doesn't match the previous entered password."
        />
      </div>

      <div class="dialog-footer">
        <RectButton
        value="Confirm"
        on:click={updatePassword}/>

        <RectButton
          value="Cancel"
          secondary={true}
          on:click={() => showPasswordDialog = false }/>
      </div>
    </div>
  </Dialog>

  <Dialog bind:active={showDelUserDialog} fullSize={true}>
    <div slot="content" bind:this={domDelUserDialog} class="delete-account-dialog-content">
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
              on:enter={onEnterValidateDeleteAccount}
              outlined={true} />
          </div>
        </div>

        <footer>
          <RectButton value="Cancel" on:click={() => showDelUserDialog = false} />
          <RectButton value="Delete" secondary={true} on:click={deleteAccount} />
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
          <SpinnerCheck isCompleted={delUserStatus === status.completed} />

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

  <Dialog
    bind:active={isImgUrlDialogActive}
    width={400}
    bg="{primary}"
    on:enter={onSaveImgUrl}>
    <div slot="content" class="edit-avatar-dialog-content">
      <CapHeader caption="Edit Avatar URL" title="Enter an image's URL"/>

      <div class="dialog-content__body" bind:this={domAvatarDialog}>
        <FlatInputIcon
          bind:value={newUserAvatarUrl}
          placeholder="Add an image's URL...">

          <div slot="icon">
            {#if newUserAvatarUrl}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eee" viewBox="0 0 24 24"><path d="M14.9 19.143l-2.78 2.779c-2.771 2.772-7.268 2.772-10.041 0-2.772-2.773-2.771-7.269 0-10.041l2.779-2.779 2.121 2.121-2.779 2.779c-1.598 1.598-1.598 4.2 0 5.797 1.6 1.6 4.201 1.6 5.799 0l2.779-2.777 2.122 2.121zm-3.02-17.063l-2.779 2.779 2.121 2.121 2.78-2.779c1.598-1.598 4.199-1.598 5.795.001 1.602 1.598 1.602 4.199.004 5.797l-2.779 2.779 2.121 2.121 2.779-2.778c2.771-2.773 2.771-7.269 0-10.041-2.774-2.772-7.27-2.772-10.042 0zm-5.945-.795l1.44-.204.438 3.083-1.438.205-.44-3.084zm-4.855 6.09l.206-1.441 3.084.44-.206 1.44-3.084-.439zm4.793-2.521l-1.028 1.03-2.205-2.203 1.029-1.029 2.204 2.202zm12.191 17.86l-1.441.204-.438-3.083 1.439-.205.44 3.084zm4.856-6.09l-.207 1.441-3.084-.439.207-1.441 3.084.439zm-4.793 2.52l1.027-1.029 2.205 2.204-1.029 1.029-2.203-2.204z"/></svg>
            {/if}
          </div>
        </FlatInputIcon>
      </div>

      <div class="buttons-row">
        <RectButton value="Cancel" on:click={onCancelEditImgUrl} secondary={true} />
        <RectButton value="Save" on:click={onSaveImgUrl} />
      </div>
    </div>
  </Dialog>
</div>
