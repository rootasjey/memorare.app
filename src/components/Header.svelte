<script context="module">
  let domHeader;
  let hidden = false;
  let attempts = 0;
  let maxAttempts = 10;

  export function hideHeader() {
    if (!domHeader) { return; }
    hidden = true; // doesn't toggle class on dom (?)
    domHeader.classList.add('hidden');
    attempts = 0;
  }

  export function hideHeaderAsync() {
    if (attempts > maxAttempts) { return; }

    attempts++;

    if (!domHeader) {
      setTimeout(() => {
        hideHeaderAsync();
      }, 200);

      return;
    }

    hideHeader();
  }

  export function showHeader() {
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

  import {
    disableBodyScroll,
    enableBodyScroll,
  } from '../utils';

  let username = settings.getValue('name');

  let userBgImg = `background-image: url("${getUserAvatar()}");`;

  $: if ($isUserAuthenticated) { username = settings.getValue('name'); }
  $: if ($isAvatarUpdated) { userBgImg = `background-image: url("${getUserAvatar()}");`; }

  let active = false;
  let activeIndex = 0;
  let domUserAvatar;
  let domUserNav;
  let isTinyNavVisible = false;
  let isUserMenuOpened = false;

  const menuItems = [
    {
      type: 'multiline',
      header: username,
      subheader: 'Account settings',
      action: () => goAndClose('/accountsettings'),
    },
    {
      type: 'oneline',
      header: 'Welcome',
      action: () => goAndClose('/welcome'),
    },
    {
      type: 'oneline',
      header: 'Add quote',
      action: () => goAndClose('/add/quote'),
    },
    {
      type: 'oneline',
      header: 'Sign out',
      action: () => signOut(),
    },
  ]

  function goAndClose(route) {
    onGoTo(route);
    isUserMenuOpened = false;
  }

  function onGoTo(route = '') {
    navigate(route);
    isTinyNavVisible = false;
  }

  function onBlurUserNav() {
    domUserNav.setAttribute('tabindex', '-1');
    domUserAvatar.setAttribute('tabindex', '0');
    isUserMenuOpened = false;
    enableBodyScroll();
  }

  function onKeyUpUserAvatar(keyboardEvent) {
    const { keyCode } = keyboardEvent;

    switch (keyCode) {
      case 13: // enter
        onToggleUserMenu();
        break;
      case 27: // escape
        onBlurUserNav();
        break;
      default:
        break;
    }
  }

  function onKeyUpUserNav(keyboardEvent) {
    const { keyCode } = keyboardEvent;

    switch (keyCode) {
      case 13: // enter
        const item = menuItems[activeIndex];
        if (item && item.action) { item.action(); }
        break;
      case 27: // escape
        onBlurUserNav();
        break;
      case 37: // left
        activeIndex = 0;
        break;
      case 38: // up
        activeIndex = (activeIndex - 1) % menuItems.length;
        if (activeIndex < 0) { activeIndex = menuItems.length - 1; }
        break;
      case 39: // right
        activeIndex = menuItems.length - 1;
        break;
      case 40: // down
        activeIndex = (activeIndex + 1) % menuItems.length;
        break;
      default:
        break;
    }
  }

  function onScrollToTop() {
    window.scrollTo(0, 0);
  }

  function signOut() {
    settings.clearData();

    isUserAuthenticated.set(false);
    goAndClose('/');
  }

  function onToggleNav() {
    isTinyNavVisible = !isTinyNavVisible;
  }

  function onToggleUserMenu() {
    isUserMenuOpened = !isUserMenuOpened;

    if (isUserMenuOpened) {
      disableBodyScroll();
      domUserAvatar.setAttribute('tabindex', '-1');

      setTimeout(() => {
        domUserNav.setAttribute('tabindex', '0');
        domUserNav.focus();
      }, 250);
    }
  }
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
    align-items: center;
    cursor: pointer;

    transition:.3s;
  }

  .header-title h3 {
    font-family: 'Introscript';
    font-size: 2em;
    margin: 0;
    opacity: .7;
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
    align-items: center;

    position: relative;
    top: 5px;
  }

  nav > div {
    color: #000;
    display: inline-block;
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

  .multiline {
    display: flex;
    flex-direction: column;
  }

  .multiline > span:first-child {
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
  }

  .multiline > span:last-child {
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
    outline: none;

    position: relative;
    top: 0px;

    box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:hover,
  .user-avatar:focus {
    top: 2px;
    filter: brightness(95%);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .user-avatar:active,
  .user-avatar.active {
    top: 4px;
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
    outline: none;

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

  .user-nav li:hover,
  .user-nav li.focus {
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
  <div class="header-title" on:click={() => onGoTo('/')} >
    <img src="/img/icon.png" alt="memorare icon" width="48" height="48" on:click={onScrollToTop}>
    <h3>memorare</h3>
  </div>

  <nav>
    <div on:click={() => onGoTo('/apps')}> Apps </div>
    <div on:click={() => onGoTo('/developers')}> Developers </div>
    <div on:click={() => onGoTo('/pricing')}> Pricing </div>

    {#if $isUserAuthenticated}
      <div
        class="user-avatar"
        class:active={isUserMenuOpened}
        tabindex="0"
        bind:this={domUserAvatar}
        on:click={onToggleUserMenu}
        on:keyup={onKeyUpUserAvatar}>

        <div class="user-avatar__img" style="{userBgImg}"></div>
      </div>
    {:else}
      <div on:click={() => onGoTo('/signin')} class="button-pink-round">Sign  in</div>
    {/if}
  </nav>

  {#if isUserMenuOpened}
    <nav
      class="user-nav"
      bind:this={domUserNav}
      on:blur={onBlurUserNav}
      on:keyup={onKeyUpUserNav}
      transition:fly={{ y: 10 }}>
      <ul>
        {#each menuItems as item, i}
          <li
            class:multiline={item.type === 'multiline'}
            class:focus={activeIndex === i}
            on:click={() => item.action()}>

            {#if item.type === 'multiline'}
              <span class="header">{item.header}</span>
              <span class="subheader">{item.subheader}</span>
            {:else}
              {item.header}
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  {/if}

  {#if isTinyNavVisible}
    <nav class="tinyNav" transition:fly="{{ y: 200, duration: 1000 }}">
      <div on:click={() => onGoTo('/apps')}> Apps </div>
      <div on:click={() => onGoTo('/developers')}> Developers </div>
      <div on:click={() => onGoTo('/pricing')}> Pricing </div>
      <div on:click={() => onGoTo('/signin')} class="button-pink-round"> Sign  in</div>
    </nav>
  {/if}

  <div class="amburger-menu" on:click={onToggleNav}>
    <div class="amburger-menu__line line-1"></div>
    <div class="amburger-menu__line line-2"></div>
    <div class="amburger-menu__line line-3"></div>
  </div>
</header>
