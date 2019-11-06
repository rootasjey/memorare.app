<script>
  import { navigate } from 'svelte-routing';


  import {
    hide as hideHeader,
    show as showHeader
  } from '../components/Header.svelte';

  import ProfileCircle from '../components/ProfileCircle.svelte';

  import {
    client,
    AUTHOR,
    QUOTES_BY_AUTHOR_ID,
  } from '../data';

  import { canI } from '../settings';

  import { scrollToTop } from '../utils';

  export let id = '';

  let author = {};
  let quotes = [];

  const canIEditAuthor = canI('editAuthor');

  fetchAuthor();
  fetchAuthorQuotes();

  async function fetchAuthor() {
    const response = await client.query({
      query: AUTHOR,
      variables: { id },
    });

    author = response.data.author;
    hideHeader();
    scrollToTop();
  }

  async function fetchAuthorQuotes() {
    const response = await client.query({
      query: QUOTES_BY_AUTHOR_ID,
      variables: { authorId: id },
    });

    quotes = response.data.quotesByAuthorId.entries;
  }

  function goBack() {
    showHeader();
    window.history.back();
  }

  function onEditAuthor() {
    navigate(`/edit/author/${id}`);
  }
</script>

<style>
  .author__page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  body {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    padding: 100px 0;
  }

  header {
    background-color: #706fd3;

    height: 100vh;
    width: 100%;
  }

  .header__bg {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;

    opacity: .1;
    position: absolute;
  }

  .header__text {
    color: #fff;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 50px;
    max-width: 60%;
  }

  .header__summary {
    font-size: 1.5em;
    font-weight: 200;
  }

  .header__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    top: 200px;
  }

  .square-icon {
    cursor: pointer;
    transform-origin: center;

    padding: 20px;
    background-color: #f56498;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .square-icon:hover {
    top: 32px;
    filter: brightness(95%);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .square-icon:active {
    top: 34px;
    filter: brightness(90%);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .square-icon > svg {
    transform-origin: center;
    transition: .3s;
  }

  .square-icon > svg:hover {
    transform: rotate(180deg);
    transform-origin: center;
    transition: .3s;
  }

  .close-icon {
    position: absolute;
    top: 30px;
    right: 30px;
  }

  .edit-icon {
    position: absolute;
    top: 30px;
    right: 105px;
  }

  .quote-card-compact {
    color: white;
    background-color: #706fd3;

    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    border-radius: 5px;
    padding: 40px;

    width: 300px;
    margin: 10px;
  }

  .quote-card-compact__content {
    font-size: 1.2em;
    font-weight: 500;
  }
</style>

<div class="author__page">
  <header>
    <div class="header__bg" style="background-image: url('{author.imgUrl}')"></div>

    <div class="square-icon close-icon" on:click={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
      </svg>
    </div>

    {#if canIEditAuthor}
      <div class="square-icon edit-icon" on:click={onEditAuthor}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M1.439 16.873l-1.439 7.127 7.128-1.437 16.873-16.872-5.69-5.69-16.872 16.872zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zm15.031-15.032l-13.617 13.618-2.86-2.861 10.825-10.826 2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"/></svg>
      </div>
    {/if}

    <div class="header__content">
      <ProfileCircle imgUrl="{author.imgUrl}" />

      <div class="header__text">
        <h1 class="header__title">{author.name}</h1>
        <span class="header__summary">{author.summary}</span>
      </div>
    </div>
  </header>

  <body>
    {#each quotes as quote}
      <div class="quote-card-compact">
        <div class="quote-card-compact__content">{quote.name}</div>
      </div>
    {:else}
       <h2>No quotes for this author.</h2>
    {/each}
  </body>

</div>
