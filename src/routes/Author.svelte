<script>
  import Avatar from '../components/Avatar.svelte';
  import {
    hide as hideHeader,
    show as showHeader
  } from '../components/Header.svelte';

  import {
    client,
    AUTHOR,
    QUOTES_BY_AUTHOR_ID,
  } from '../data';

  export let id = '';

  let author = {};
  let quotes = [];

  fetchAuthor();
  fetchAuthorQuotes();

  async function fetchAuthor() {
    const response = await client.query({
      query: AUTHOR,
      variables: { id },
    });

    author = response.data.author;
    hideHeader();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  .close-icon {
    position: absolute;
    top: 30px;
    right: 30px;

    cursor: pointer;
    transform-origin: center;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s;
  }

  .close-icon:hover {
    transform: rotate(180deg);
    transform-origin: center;
    transition: .3s;
  }

  .quote-card-compact {
    color: white;
    background-color: #706fd3;

    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    border-radius: 5px;
    padding: 40px;

    width: 300px;
  }

  .quote-card-compact__content {
    font-size: 1.2em;
    font-weight: 500;
  }
</style>

<div class="author__page">
  <header>
    <div class="header__bg" style="background-image: url('{author.imgUrl}')"></div>

    <div class="close-icon" on:click={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
      </svg>
    </div>

    <div class="header__content">
      <Avatar imgUrl="{author.imgUrl}" />

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
