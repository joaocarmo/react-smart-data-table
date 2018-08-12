const path = require('path')

const testConfig = {
  context: path.join(__dirname, '/lib'),
  entry: ['./test.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'test.js',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/react',
              [
                '@babel/env',
                {
                  useBuiltIns: 'usage',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}

const prodConfig = {
  context: path.join(__dirname, '/lib'),
  entry: [
    '@babel/polyfill',
    './index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'react.smart.data.table.js',
    library: 'SmartDataTable',
    libraryTarget: 'umd',
  },
  // externals: {},
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/react',
              [
                '@babel/env',
                {
                  useBuiltIns: 'usage',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}

function buildConfig(env) {
  switch (env) {
    case 'test':
      return testConfig
    default:
      return prodConfig
  }
}

module.exports = buildConfig
