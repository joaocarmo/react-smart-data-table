/* eslint-disable */
const path = require('path')
const babelOptions = require('./babel.config')

const exampleDir = path.join(__dirname, 'example')
const distDir = path.join(__dirname, 'dist')
const devDir = path.join(__dirname, 'dev')

const { NODE_ENV } = process.env

const mode = NODE_ENV || 'development'

module.exports = {
  mode,
  context: exampleDir,
  entry: `./index.js`,
  output: {
    path: distDir,
    filename: 'example.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /.(j|t)sx?$/,
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
    hot: true,
    port: 3000,
    static: {
      directory: devDir,
      serveIndex: true,
    },
  },
}
