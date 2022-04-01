<svelte:head>
  <link rel="stylesheet" href="../styles/normalize.css" />
  <link rel="stylesheet" href="../styles/skeleton.css" />
</svelte:head>

<nav class="navbar">
  <div class="container">
    <ul class="navbar-list">
      <li class="navbar-item">Item 1</li>
      <li class="navbar-item">Item 2</li>
    </ul>
  </div>
</nav>

<slot />

<style>
  @import url('https://fonts.googleapis.com/css?family=Raleway');

  .navbar {
    font-family: 'Raleway';
    display: block;
    width: 100%;
    height: 6.5rem;
    background: #fff;
    z-index: 99;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .navbar-list {
    list-style: none;
    margin-bottom: 0;
  }

  .navbar-item {
    position: relative;
    float: left;
    margin-bottom: 0;
  }
</style>
