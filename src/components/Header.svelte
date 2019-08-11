<script>
  import { Link, navigate } from 'svelte-routing';

  function gotoHome() {
    navigate('/')
  }
</script>

<style>
  header {
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
  }

  .header-title {
    display: flex;

    cursor: pointer;
    transition:.5s;
  }

  .header-title img {
    position: relative;
    top: -10px;
  }

  .header-title:hover {
    color: tomato;
    transition: .5s;
  }

  nav {
    display: flex;
    justify-content: space-between;

    position: relative;
    top: 5px;
  }

  nav > p {
    display: inline-block;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-right: 25px;

    cursor: pointer;

    transition: .5s;
  }

  nav > p:hover {
    color: tomato;
    transition: .5s;
  }

  nav :global(a) {
    display: inline-block;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-right: 25px;

    cursor: pointer;

    transition: .5s;
  }

  nav :global(a):hover {
    color: tomato;
    transition: .5s;
  }
</style>

<header>
  <div class="header-title" on:click={gotoHome} >
    <img src="./icon.png" alt="memorare icon" width="64">
    <h3>memorare</h3>
  </div>

  <nav>
    <Link to="apps">Apps</Link>
    <p>Developers</p>
    <Link>Pricing</Link>
    <Link>Sign in</Link>
  </nav>
</header>
