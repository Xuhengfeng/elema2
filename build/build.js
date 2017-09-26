//文件是 webpack 的打包编译配置文件

require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')//转圈等待中 长时间异步提示
var rm = require('rimraf')//代替物:The UNIX command rm -rf for node.
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')//导入webpack
var config = require('../config')//导入config目录
var webpackConfig = require('./webpack.prod.conf') //导入生产配置的webpack配置文件

var spinner = ora('building for production...')
spinner.start()
//每次build都删除一次dist
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  //调用webpack,导入webpackConfig
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
