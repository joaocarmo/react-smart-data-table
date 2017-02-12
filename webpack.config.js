var config = {
  context: __dirname + '/lib',
  //entry: './index.js',
  entry: './test.js',
  output: {
    path: __dirname + '/dist',
    //filename: 'react.smart.data.table.js'
    filename: 'test.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'es2015' ]
        }
      }
    ],
  }
};

module.exports = config;
