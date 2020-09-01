const path = require('path')
const babelOptions = require('./babel.config')

const exampleDir = path.join(__dirname, 'example')
const distDir = path.join(__dirname, 'dist')

module.exports = {
  context: exampleDir,
  entry: ['./test.js'],
  output: {
    path: distDir,
    filename: 'test.js',
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
}
