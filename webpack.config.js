const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babelOptions = require('./babel.config')
const pkg = require('./package')

const libDir = path.join(__dirname, 'lib')
const distDir = path.join(__dirname, 'dist')
const testDir = path.join(__dirname, 'test')

const { NODE_ENV } = process.env

const mode = NODE_ENV || 'development'

module.exports = {
  mode,
  context: libDir,
  entry: './index.js',
  output: {
    path: distDir,
    filename: `${pkg.name}.js`,
    library: 'SmartDataTable',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [
    {
      'escape-string-regexp': 'escape-string-regexp',
      flat: 'flat',
      linkifyjs: 'linkifyjs',
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
        test: /.jsx?$/,
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
  devServer: {
    compress: true,
    contentBase: [distDir, testDir],
    open: true,
    overlay: true,
    port: 3000,
  },
}
