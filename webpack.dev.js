const path = require('path')
const babelOptions = require('./babel.config')

const exampleDir = path.join(__dirname, 'example')
const distDir = path.join(__dirname, 'dist')
const devDir = 'dev'

const { NODE_ENV } = process.env

const mode = NODE_ENV || 'development'

module.exports = {
  mode,
  context: exampleDir,
  entry: `./index.js`,
  output: {
    path: distDir,
    filename: 'test.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    compress: true,
    contentBase: [devDir],
    overlay: true,
    hot: true,
    injectHot: true,
    injectClient: true,
    port: 3000,
    index: 'index.html',
  },
}
