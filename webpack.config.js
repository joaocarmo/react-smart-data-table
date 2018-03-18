var webpack = require('webpack');

var devConfig = {
  context: __dirname + '/lib',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'react.smart.data.table.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'env' ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};

var testConfig = {
  context: __dirname + '/lib',
  entry: './test.js',
  output: {
    path: __dirname + '/dist',
    filename: 'test.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'env' ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};

var prodConfig = {
  context: __dirname + '/lib',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'react.smart.data.table.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'env' ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};

function buildConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

module.exports = buildConfig;
