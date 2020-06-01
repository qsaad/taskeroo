const nodeExternals = require('webpack-node-externals')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'taskeroo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'todo list webapp' },
      { name: 'apple-mobile-web-app-status-bar', content: '#AA7700' },
      { name: 'them-color', content: '#FFE1C4' },
      //{ authorization : 'BPIMuMOVx2ZqzCqO-c1xCy0Kh06nrPFhc76uqdvkMORzDxA3l72q2_foeNvajELRVwntQ5wIf3Im5qRhfj0GMLY', Content: 'application/json'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'manifest',  href: '/manifest.json' },
      //IOS SUPPORT
      { rel: 'apple-touch-icon',  href: '/icons/pelm_logo_96_96.png' },
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/firebase.js',
    '~/plugins/vueclipboard.js',
  ],
  // manifest: {
  //   gcm_sender_id: '103953800507'
  // },
  css: ['~/assets/style/app.styl'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^vuetify/],
    plugins: [
      new VuetifyLoaderPlugin()
    ],
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }

      // if (process.server) {
      //   config.externals = [
      //     nodeExternals({
      //       whitelist: [/^vuetify/]
      //     })
      //   ]
      // }

    }
  }
}
