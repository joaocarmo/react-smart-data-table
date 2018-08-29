const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  context: path.join(__dirname, '/example'),
  entry: [
    './test.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'test.js',
  },
})
