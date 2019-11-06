<script context="module">
  let domHeader;
  let hidden = false;
  let attempts = 0;
  let maxAttempts = 10;

  export function hide() {
    if (!domHeader) { return; }
    hidden = true; // doesn't toggle class on dom (?)
    domHeader.classList.add('hidden');
    attempts = 0;
  }

  export function hideAsync() {
    if (attempts > maxAttempts) { return; }

    attempts++;

    if (!domHeader) {
      setTimeout(() => {
        hideAsync();
      }, 200);

      return;
    }

    hide();
  }

  export function show() {
    if (!domHeader) { return; }
    hidden = false; // doesn't toggle class on dom (?)
    domHeader.classList.remove('hidden');
  }
</script>

<script>
  import { fly } from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import {
    getUserAvatar,
    isAvatarUpdated,
    isUserAuthenticated,
    settings,
  } from '../settings';

  let username = settings.getValue('name');

  let userBgImg = `background-image: url("${getUserAvatar()}");`;

  $: if ($isUserAuthenticated) { username = settings.getValue('name'); }
  $: if ($isAvatarUpdated) { userBgImg = `background-image: url("${getUserAvatar()}");`; }

  let active = false;
  let isTinyNavVisible = false;
  let isUserMenuOpened = false;

  function gotoTop() {
    window.scrollTo(0, 0);
  }

  function goTo(route) {
    navigate(route);
    isTinyNavVisible = false;
  }

  function toggleNav() {
    isTinyNavVisible = !isTinyNavVisible;
  }

  function goAndClose(route) {
    goTo(route);
    isUserMenuOpened = false;
  }

  function signOut() {
    settings.clearData();

    isUserAuthenticated.set(false);
    goAndClose('/');
  }

  const toggleUserMenu = () => isUserMenuOpened = !isUserMenuOpened;
</script>

<style>
  header {
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
  }

  .hidden {
    display: none;
  }

  .header-title {
    display: flex;

    cursor: pointer;
    transition:.3s;
  }

  .header-title img {
    position: relative;
    top: 5px;

    border-radius: 50%;

    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    margin-right: 10px;
    transition: .3s;
  }

  .header-title img:hover {
    top: 7px;
    filter: brightness(95%);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .header-title img:active {
    top: 9px;
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    transition: .3s;
  }

  .header-title:hover {
    color: #f56498;
    transition: .3s;
  }

  nav {
    display: flex;
    justify-content: space-between;

    position: relative;
    top: 5px;
  }

  nav > div {
    color: #000;
    display: inline-block;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-right: 25px;

    cursor: pointer;

    transition: .3s;
  }

  nav > div:hover {
    color: #706fd3;
    transition: .3s;
  }

  nav > div.button-pink-round {
    color: white;
    background: #f56498;

    padding: 10px 15px;
    border-radius: 30px;

    position: relative;
    top: -10px;
    left: 5px;
    transition: .3s;
  }

  nav > div.button-pink-round:hover {
    padding: 10px 20px;
    transition: .3s;
  }

  nav :global(a) {
    display: inline-block;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-right: 25px;

    cursor: pointer;

    transition: .3s;
  }

  nav :global(a):hover {
    color: #720fd3;
    transition: .3s;
  }

  .amburger-menu {
    position: fixed;
    bottom: 30px;
    right: 20px;
    display: none;

    height: 30px;
    width: 30px;

    cursor: pointer;
    opacity: .6;
    transition: .3s;
  }

  .amburger-menu:hover {
    opacity: 1;
    transition: .3s;
  }

  .amburger-menu__line {
    height: 5px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    margin: 5px;
  }

  .item-multiline {
    display: flex;
    flex-direction: column;
  }

  .item-multiline > span:first-child {
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
  }

  .item-multiline > span:last-child {
    font-size: .8em;
    font-weight: lighter;
  }

  .tinyNav {
    display: none;
  }

  .user-avatar {
    height: 40px;
    width: 40px;
    background-color: #fff;

    position: relative;
    top: -10px;

    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:hover {
    top: -8px;
    filter: brightness(95%);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:active,
  .user-avatar.active {
    top: -6px;
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar__img {
    width: 100%;
    height: 100%;

    background-size: cover;
    background-position: center center;
  }

  .user-nav {
    display: flex;
    flex-direction: column;

    position: absolute;
    right: 60px;
    top: 80px;

    color: #000;
    background-color: #fff;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    z-index: 4;
  }

  .user-nav > ul {
    padding: 0;
  }

  .user-nav li {
    list-style-type: none;
    padding: 15px 20px;
    cursor: pointer;

    transition: .3s;
  }

  .user-nav li:hover {
    background: rgb(206, 203, 203);
    transition: .3s;
  }

  @media (max-width: 670px) {
    header {
      position: fixed;
      bottom: 0;

      background: #eee;

      padding: 20px 0;
      padding-left: 20px;
      width: 100%;

      justify-content: flex-start;

      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

      z-index: 4;
    }

    .header-title > h3 {
      display: none;
    }
  }

  @media (max-width: 410px) {
    nav {
      display: none;
    }

    .tinyNav {
      display: flex;
      flex-direction: column;
      align-items: center;

      width: 100%;
      height: 300%;

      position: absolute;
      top: -300%;
      left: 0;

      background-color: #f5f6fa;
    }

    .amburger-menu {
      display: block;
    }
  }

</style>

<header class:hidden bind:this={domHeader}>
  <div class="header-title" on:click={() => goTo('/')} >
    <img src="/img/icon.png" alt="memorare icon" width="48" height="48" on:click={gotoTop}>
    <h3>memorare</h3>
  </div>

  <nav>
    <div on:click={() => goTo('/apps')}> Apps </div>
    <div on:click={() => goTo('/developers')}> Developers </div>
    <div on:click={() => goTo('/pricing')}> Pricing </div>

    {#if $isUserAuthenticated}
      <div class="user-avatar" class:active={isUserMenuOpened} on:click={toggleUserMenu}>
        <div class="user-avatar__img" style="{userBgImg}"></div>
      </div>
    {:else}
      <div on:click={() => goTo('/signin')} class="button-pink-round">Sign  in</div>
    {/if}
  </nav>

  {#if isUserMenuOpened}
    <nav class="user-nav" transition:fly={{ y: 10 }}>
      <ul>
        <li class="item-multiline" on:click={() => goAndClose('/accountsettings')}>
          <span class="header">{username}</span>
          <span class="subheader">Account settings</span>
        </li>
        <li on:click={() => goAndClose('/welcome')}>Welcome</li>
        <li on:click={() => goAndClose('/add/quote')}>Add quote</li>
        <li>Favorites</li>
        <li>Lists</li>
        <li on:click={signOut}>Sign out</li>
      </ul>
    </nav>
  {/if}

  {#if isTinyNavVisible}
    <nav class="tinyNav" transition:fly="{{ y: 200, duration: 1000 }}">
      <div on:click={() => goTo('/apps')}> Apps </div>
      <div on:click={() => goTo('/developers')}> Developers </div>
      <div on:click={() => goTo('/pricing')}> Pricing </div>
      <div on:click={() => goTo('/signin')} class="button-pink-round"> Sign  in</div>
    </nav>
  {/if}

  <div class="amburger-menu" on:click={toggleNav}>
    <div class="amburger-menu__line line-1"></div>
    <div class="amburger-menu__line line-2"></div>
    <div class="amburger-menu__line line-3"></div>
  </div>
</header>
