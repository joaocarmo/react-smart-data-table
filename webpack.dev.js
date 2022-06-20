const path = require('path')
const babelOptions = require('./babel.config')
const pkg = require('./package.json')

const devDir = path.join(__dirname, 'docs')
const distDir = path.join(__dirname, 'dist')
const exampleDir = path.join(__dirname, 'example')
const libDir = path.join(__dirname, 'lib')

const { NODE_ENV } = process.env

const mode = NODE_ENV || 'development'

module.exports = {
  mode,
  context: exampleDir,
  entry: `./index`,
  output: {
    path: distDir,
    filename: 'example.js',
  },
  resolve: {
    alias: {
      'react-smart-data-table-dev': mode === 'development' ? libDir : __dirname,
      'react-smart-data-table-dev.css':
        mode === 'development' ? false : path.join(distDir, `${pkg.name}.css`),
    },
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
