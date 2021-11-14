const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babelOptions = require('./babel.config')
const pkg = require('./package.json')

const libDir = path.join(__dirname, 'lib')
const distDir = path.join(__dirname, 'dist')

const { NODE_ENV } = process.env

const mode = NODE_ENV || 'development'

module.exports = {
  mode,
  context: libDir,
  entry: './index',
  output: {
    path: distDir,
    filename: `${pkg.name}.js`,
    library: 'SmartDataTable',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    {
      clsx: 'clsx',
      'escape-string-regexp': 'escape-string-regexp',
      flat: 'flat',
      linkifyjs: 'linkifyjs',
      'prop-types': 'prop-types',
      'snake-case': 'snake-case',
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
  ],
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${pkg.name}.css`,
    }),
  ],
}
