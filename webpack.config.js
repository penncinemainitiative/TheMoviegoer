const webpack = require("webpack");

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    sources.push('webpack/hot/only-dev-server');
  }
  return sources;
}

module.exports = {
  entry: getEntrySources(['./src/client/client.js']),
  output: {
    filename: 'public/bundle.js',
    publicPath: 'http://localhost:8080/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel?cacheDirectory']
    }]
  },
  plugins: process.env.NODE_ENV === "production" ? [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      })
    ] : []
};