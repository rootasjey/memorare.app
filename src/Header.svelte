<script>
  // your script goes here
</script>

<style>
  header {
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
  }

  .header-title {
    cursor: pointer;
    transition:.5s;
  }

  .header-title:hover {
    color: tomato;
    transition: .5s;
  }

  nav {
    display: flex;
    justify-content: space-between;
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
    <h3>memorare</h3>
  </div>

  <nav>
    <p>Apps</p>
    <p>Developers</p>
    <p>Pricing</p>
    <p>Sign in</p>
  </nav>
</header>
