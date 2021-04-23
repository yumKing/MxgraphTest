module.exports = {
  publicPath: '/mxtest',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,

  // chainWebpack: config => {
  //   //  vue cli3.0 使用 svg-sprite webpack的配置
  //   config.module.rules.delete("svg"); // 重点:删除默认配置中处理svg,
  //   // const svgRule = config.module.rule('svg')
  //   // svgRule.uses.clear()
  //   config.module
  //     .rule('svg-sprite-loader')
  //     .test(/\.svg$/)
  //     .include
  //     .add(resolve('src/icons')) // 处理svg目录
  //     .end()
  //     .use('svg-sprite-loader')
  //     .loader('svg-sprite-loader')
  //     .options({
  //       symbolId: 'icon-[name]'
  //     });

  //   config.output.filename('[name].[hash].js').end();
  // },

  productionSourceMap: true,

  css: {

    //  是否使用css分离插件 ExtractTextPlugin
    extract: true,

    //  开启 CSS source maps?
    sourceMap: false,

    //  css预设器配置项
    loaderOptions: {},

    //  启用 CSS modules for all css / pre-processor files.
    //requireModuleExtension: false

  },

  parallel: require('os').cpus().length > 1,

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