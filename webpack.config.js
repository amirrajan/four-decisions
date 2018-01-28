var webpack = require('webpack');

module.exports = {
  entry: './client/app.js',
  output: {
    path: __dirname,
    filename: './public/scripts/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: ['es2015', 'react'] },
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        query: { presets: 'es2015' },
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  stats: { colors: true },
  devtool: 'source-map',
};
