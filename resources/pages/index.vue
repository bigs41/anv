<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Universal Vue.js Applications Framework
    </h1>
    <v-btn color="red" to="/about">About page</v-btn>
    <nuxt-link class="button" to="/about">
      About page
    </nuxt-link>
  </section>
</template>

<style scoped>
.title
{
  margin: 50px 0;
}
</style>
