<script>
  import { fly } from 'svelte/transition';
  import { navigate } from 'svelte-routing';

  import {
    client,
    DELETE_AUTHOR,
    LIST_AUTHORS,
  } from '../data';

  import { show } from '../components/Snackbar.svelte';
  import { handle } from '../errors';

  let limit = 10;
  let skip  = 0;
  let order = -1;

  let authors = [];

  let selectedId = -1;

  fetchAuthors();

  async function fetchAuthors() {
    const response = await client.query({
      query: LIST_AUTHORS,
      variables: { limit, order, skip },
    });

    authors = response.data.authors.entries;
  }

  function onToggleButtons(id) {
    selectedId = selectedId === id ? -1 : id;
  }

  function onClickAuthor(id) {
    if (!id) {
      show({
        text: `This author has an invalid id. Try to refresh the page.`,
        type: 'error',
      });
      return;
    }

    navigate(`/author/${id}`);
  }

  async function onDeleteAuthor(id) {
    try {
      const response = await client.mutate({
        mutation: DELETE_AUTHOR,
        variables: { id },
      });

      const { name: authorName } = response.data.deleteAuthor;

      authors = authors.filter((author) => author.id !== id);

      show({
        text: `The author "${authorName}" has successfully been deleted`,
        type: 'success',
      });

    } catch (error) {
      handle(error);
    }
  }

  function onGoToEditAuthor(id) {
    navigate(`/edit/author/${id}`);
  }

  function onShare(author = {}) {
    show({
      text: 'The share action is not yet available.'
    });
  }
</script>

<style>
  .authors {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .column-center {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 40px 0;
  }

  .row-center {
    display: flex;
    flex-direction: row;
    align-items: center;

    flex-wrap: wrap;

    margin: 40px 0;
  }

  .title {
    font-size: 1.5em;
    font-weight: 600;
  }

  .author-card {
    width: 240px;
    height: 330px;

    margin: 20px;
    cursor: pointer;

    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    border-radius: 20px;
    position: relative;

    transition: .3s;
  }

  .author-card:hover {
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .author-card__bg {
    width: 100%;
    height: 100%;

    background-color: #706fd3;
    border-radius: 20px;
    opacity: .8;

    position: absolute;
    top: 0;

    z-index: 2;
    transition: .3s;
  }

  .author-card__bg:hover {
    opacity: .6;
    transition: .3s;
  }

  .author-card__img {
    width: 100%;
    height: 100%;

    border-radius: 20px;
    position: absolute;
    top: 0;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    z-index: 1;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
  }

  .author-card__text {
    height: 30px;
    width: 100%;

    color: rgba(0,0,0,0.42);
    background-color: #ef5777;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    bottom: 0;
    z-index: 3;

    padding: 15px 0;
    border-radius: 0 0 20px 20px;

    transition: .3s;
  }

  .author-card__name {
    font-size: 1.5em;
    font-weight: 600;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .author-card__content {
    width: 100%;
    height: 100%;

    z-index: 3;
  }

  .circle-button {
    width: 40px;
    height: 40px;

    background-color: #eee;
    border-radius: 50%;
    margin: 5px;

    cursor: pointer;
    z-index: 3;

    position: relative;
    top: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .circle-button:hover {
    top: -2px;
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .circle-button > span {
    color: rgba(0,0,0,0.42);
    font-size: 2em;
    font-weight: bolder;

    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    top: -9px;
  }

  .buttons-list {
    display: flex;
    flex-direction: column;

    position: absolute;
    top: 10px;
    right: 10px;
  }

  .buttons-list__conditional {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="authors">
  <header>
    <h1>Authors</h1>
  </header>

  <body class="row-center">
    {#each authors as author}
      <div class="author-card">
        <div class="author-card__bg" on:click={() => onClickAuthor(author.id)}></div>
        <div class="author-card__img"
          style="{`background-image: url('${author.imgUrl ? author.imgUrl : '/img/user-icon.png'}');`}">
        </div>

        <div class="author-card__content">
          <div class="buttons-list">
            <div class="circle-button" on:click={() => onToggleButtons(author.id)}>
              <span>...</span>
            </div>

            {#if selectedId === author.id}
              <div class="buttons-list__conditional">
                <div class="circle-button" on:click={() => onShare(author)} transition:fly="{{ y: 10, duration: 100 }}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
                  </svg>
                </div>

                <div class="circle-button" on:click={() => onGoToEditAuthor(author.id)} transition:fly="{{ y: 10, duration: 200 }}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M1.439 16.873l-1.439 7.127 7.128-1.437 16.873-16.872-5.69-5.69-16.872 16.872zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zm15.031-15.032l-13.617 13.618-2.86-2.861 10.825-10.826 2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"/>
                  </svg>
                </div>

                <div class="circle-button" on:click={() => onDeleteAuthor(author.id)} transition:fly="{{ y: 10, duration: 300 }}">
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/>
                  </svg>
                </div>
              </div>
            {/if}
          </div>

          <div class="author-card__text"
            on:click={() => onClickAuthor(author.id)}>

            <span class="author-card__name"> {author.name} </span>
          </div>
        </div>
      </div>
    {:else}
      <div class="column-center">
        <span class="title">No authors found :(</span>
        <p>There may be a connection issue.</p>
      </div>
    {/each}
  </body>
</div>
