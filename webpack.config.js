const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  context: path.join(__dirname, 'lib'),
  entry: ['core-js/stable', './index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-smart-data-table.js',
    library: 'SmartDataTable',
    libraryTarget: 'umd',
  },
  externals: [
    {
      'escape-string-regexp': 'escape-string-regexp',
      flat: 'flat',
      linkifyjs: 'linkifyjs',
      'memoize-one': 'memoize-one',
      'snake-case': 'snake-case',
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
  ],
  devServer: {
    compress: true,
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'test')],
    open: true,
    overlay: true,
    port: 3000,
  },
})
