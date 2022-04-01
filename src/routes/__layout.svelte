<svelte:head>
  <link rel="stylesheet" href="../styles/normalize.css" />
  <link rel="stylesheet" href="../styles/skeleton.css" />
</svelte:head>

<template>
  <nav class="navbar">
    <div class="container">
      <ul class="navbar-list">
        <li class="navbar-item">Item 1</li>
        <li class="navbar-item">Item 2</li>
      </ul>
    </div>
  </nav>
</template>

<slot />

<style lang="scss" src="./__layout.scss"></style>
