<script>
  export let imgUrl = '';
  export let name = '';
  export let onClick = () => {};
</script>

<style>
  .avatar-component {
    height: 150px;
    width: 150px;
    margin: 10px;
    padding: 10px;
    border-radius: 50%;

    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: .5s;
  }

  .avatar-component:hover {
    background-color: #706fd3;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .avatar-component:hover .avatar-component__name {
    background-color: #706fd3;
    opacity: .5;
    transition: .5s;
  }

  .avatar-component:hover .avatar-component__img {
    background-color: #706fd3;
    opacity: 1;
    transition: .5s;
  }

  .avatar-component__name {
    font-size: 1.2em;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 1;
    color: rgba(0,0,0,.5);

    background-color: #eee;

    height: 100%;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;

    position: absolute;
    top: 0;

    z-index: 2;
    transition: .5s;
  }

  .avatar-component__img {
    height: 100%;
    width: 100%;

    opacity: 1;
    border-radius: 50%;

    position: absolute;

    background-repeat: no-repeat;
    background-size: cover;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");

    transition: .5s;
  }

    @media (max-width: 380px) {
    .avatar-component:nth-of-type(1n+4) {
      display: none;
    }
  }
</style>

<div class="avatar-component" on:click={onClick}>
  <div class="avatar-component__img" style="background-image: url('{imgUrl}');"></div>
  <div class="avatar-component__name">{name}
  </div>
</div>
