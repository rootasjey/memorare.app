<script>
  import { fly } from 'svelte/transition';

  export let tags = [];
  let tagValue = '';

  function onKeyup(keyEvent) {
    if (keyEvent.keyCode === 186 || keyEvent.keyCode === 188 ||
        keyEvent.keyCode === 9 || keyEvent.keyCode === 13) {

        onAddTag(tagValue);
    }
  }

  function onAddTag(name = '') {
    const computedName = name.replace(/,/ig, '').replace(/;/ig, '');

    if (!computedName || computedName.length < 2) { return; }

    tags = [...tags, computedName]
    tagValue = '';
  }

  function onRemoveTag(name = '') {
    tags = tags.filter(tag => tag !== name);
  }
</script>

<style>
  .tags-container {
    overflow: hidden;
    max-width: 500px;
  }

  .tags {
    display: flex;
    overflow-x: scroll;

    max-width: 100%;

    margin: 10px 0;
  }

  .tag {
    margin: 10px;
    padding: 10px;

    color: white;
    background-color: #706fd3;

    display: flex;
  }

  .tag-name {
    margin-right: 10px;
  }

  .cross-icon {
    color: #eee;
    cursor: pointer;
    opacity: .8;

    position: relative;
    top: -2px;

    transition: .3s;
  }

  .cross-icon:hover {
    opacity: 1;
    transition: .3s;
  }
</style>

<div class="tags-container">
  <input type="text" bind:value={tagValue} placeholder="movies, success, ..." on:keyup={onKeyup} />

  <div class="tags">
    {#each tags as tag}
      <div class="tag" on:click={() => onRemoveTag(tag)} transition:fly="{{ y: 10, duration: 500 }}" >
        <div class="tag-name"> {tag} </div>
        <span class="cross-icon">&#10539;</span>
      </div>
    {/each}
  </div>
</div>
