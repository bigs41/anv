<template>
  <v-parallax
    dark
    src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col class="text-center" cols="12">
        <h1 class="display-1 font-weight-thin mb-4">{{ error.statusCode }}</h1>
        <h4 class="subheading">{{ error.message }}</h4>
        <nuxt-link class="button" to="/" v-if="error.statusCode === 404">
          Homepage
        </nuxt-link>
      </v-col>
    </v-row>
  </v-parallax>
</template>
<script>
export default {
  props: ['error'],
  layout:'bank'
}
</script>

