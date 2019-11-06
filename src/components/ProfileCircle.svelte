<script>
  export let imgUrl = '';
  export let name = '';
  export let onClick = () => {};
  export let reveal = false;
</script>

<style>
  .profile-circle {
    height: 150px;
    width: 150px;
    margin: 10px;
    padding: 10px;
    border-radius: 50%;

    position: relative;
    top: 0;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;

    cursor: pointer;

    box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
    transition: .3s;
  }

  .profile-circle:hover {
    top: 2px;
    background-color: #706fd3;
    box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .profile-circle:active {
    top: 4px;
    background-color: #706fd3;
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  }

  .profile-circle:hover .profile-circle__name {
    background-color: #706fd3;
    opacity: .5;
    transition: .5s;
  }

  .profile-circle:hover .profile-circle__img {
    background-color: #706fd3;
    opacity: 1;
    transition: .5s;
  }

  .profile-circle__name {
    font-size: 1.2em;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: .5;
    color: rgba(0,0,0,.5);

    background-color: #706fd3;

    height: 100%;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;

    position: absolute;
    top: 0;

    z-index: 2;
    transition: .5s;
  }

  .reveal .profile-circle__name {
    opacity: 1;
    background-color: #eee;
  }

  .profile-circle__img {
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
    .profile-circle:nth-of-type(1n+4) {
      display: none;
    }
  }
</style>

<div class="profile-circle" class:reveal on:click={onClick}>
  <div class="profile-circle__img" style="background-image: url('{imgUrl}');"></div>

  <div class="profile-circle__name">{name ? name : ''}</div>
</div>
