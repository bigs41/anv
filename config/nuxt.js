'use strict'

const resolve = require('path').resolve

module.exports = {
  telemetry:true,
  /*
  ** Headers of the page
  */
  head: {
    title: 'Adonuxt',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Adonuxt project'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'favicon.ico'
      }
    ]
  },
  modules: [
    [
      '@nuxtjs/vuetify',
      /*
       ** vuetify module configuration
       ** https://github.com/nuxt-community/vuetify-module
       */
      {
        customVariables: [
          '~/assets/sass/variables.scss',
          '~/assets/sass/overrides.sass'
        ],
        theme: {
          dark: true,
          themes: {
            light: {
              primary: '#293439',
              secondary: '#9C27B0',
              drawerActive: '#707070',
            },
            dark: {
              primary: '#293439',
              secondary: '#9C27B0',
              drawerActive: '#707070',
            }
          }
        }
      }
    ]
  ],
  plugins: [
    '~/plugins',
    // '~/plugins/i18n',
    // '~/plugins/vuetify'
  ],
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#744d82' },
  /*
  ** Point to resources
  */
  srcDir: resolve(__dirname, '..', 'resources')
}
