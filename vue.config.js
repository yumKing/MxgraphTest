module.exports = {
  publicPath: '/mxtest',
  assetsDir: 'static',
  lintOnSave: true,

  productionSourceMap: true,

  css: {
    loaderOptions: {}
  },

  //  see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  //  webpack-dev-server 相关配置
  // devServer: {

  // open: false, //  服务启动后自动打开浏览器访问配置

  //  host: 'localhost', //  服务ip

  // port: 8081,

  // // https: false,

  // hotOnly: false,

  // proxy: {
  // '/intelligent-recomment-service/v1': {
  //   target: 'http://localhost:8080', //  代码的服务地址
  //   // ws: true, //  proxy websockets
  //   changeOrigin: true, //  启动虚拟主机站点
  //   pathRewrite: {
  //     '^/intelligent-recomment-service': '',
  //   },
  // },
  // '/intelligent-recomment-service/ws': {
  //   target: 'ws://localhost:8080', //  代码的服务地址
  //   ws: true, //  proxy websockets
  //   changeOrigin: true, //  启动虚拟主机站点
  //   logLevel: 'debug',
  //   pathRewrite: {
  //     '^/intelligent-recomment-service': '',
  //   }
  // }
  // },

  // before: app => {
  // const wsProxy = createProxyMiddleware ({
  //   target: 'http://localhost:8080',
  //   changeOrigin: true,
  //   ws: true,
  //   logLevel: 'debug',
  //   pathRewrite: {
  //     '^/intelligent-recomment-service': '',
  //   }
  // });
  // app.use('/intelligent-recomment-service/ws', wsProxy);
  // },
  // after: app => {

  // }

  // },

  //  第三方插件配置
  pluginOptions: {

    //  ...

  }
}