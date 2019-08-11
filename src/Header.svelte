<script>
  // import memorareIcon from './memorare-icon-small.png';

  // export const icon = memorareIcon;
</script>

<style>
  header {
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
  }

  .header-title {
    display: flex;
    /* align-items: center; */

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
    margin-right: 25px;

    cursor: pointer;

    transition: .5s;
  }

  nav > p:hover {
    color: tomato;
    transition: .5s;
  }
</style>

<header>
  <div class="header-title">
    <img src="./icon.png" alt="memorare icon" width="64">
    <h3>memorare</h3>
  </div>

  <nav>
    <p>Apps</p>
    <p>Developers</p>
    <p>Pricing</p>
    <p>Sign in</p>
  </nav>
</header>
