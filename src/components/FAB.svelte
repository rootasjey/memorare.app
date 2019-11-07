<!-- Floating Action Button -->
<script>
  import { fly } from 'svelte/transition';

  import IconButton from '../components/IconButton.svelte';
  import { scrollToTop } from '../utils';

  let hidden = true;

  main();

  function main() {
    document.body.onscroll = (event) => {
      if (event.target.scrollingElement.scrollTop === 0) {
        hidden = true;
        return;
      }

      hidden = false;
    }
  }

  function onClick() {
    scrollToTop();
  }
</script>

<style>
  .fab {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: fixed;
    bottom: 10px;
    right: 10px;

    z-index: 10;
  }
</style>

{#if !hidden}
  <div class="fab" transition:fly={{ y: 10, duration: 300 }}>
      <IconButton
        margin="5px"
        backgroundColor="#f56498"
        on:click={onClick}
        elevation={1}>
        <svg slot="svg" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="#fff" transform="rotate(180)"
          viewBox="0 0 24 24">
          <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/>
        </svg>
      </IconButton>
  </div>
{/if}
