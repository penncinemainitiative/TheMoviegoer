const webpack = require("webpack");

const production = process.env.NODE_ENV === 'production';

function getEntrySources(sources) {
  if (!production) {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    sources.push('webpack/hot/only-dev-server');
  }
  return sources;
}

function getPlugins() {
  const env = production ?
    JSON.stringify('production') :
    JSON.stringify('development');
  const host = production ?
    JSON.stringify('http://pennmoviegoer.com/') :
    JSON.stringify('http://localhost:8000/');
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': env,
        'HOST_NAME': host
      }
    })];
  if (production) {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      }));
  }
  return plugins;
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
  plugins: getPlugins()
};