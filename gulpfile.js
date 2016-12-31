var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var path = require('path');

var paths = {
  src: 'src/**/*.js',
  common: 'src/common/**/*.js',
  client: 'src/client/**/*.js',
  server: 'src/server/**/*.js',
  views: 'views/**/*',
  static: 'static/**/*',
  public: 'public',
  dist: 'dist'
};

gulp.task('client', function () {
  return gulp.src('./src/client/client.js')
    .pipe(webpack({
      entry: './src/client/client.js',
      output: {
        path: path.join(__dirname, paths.public + '/assets'),
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel'
        }]
      },
      plugins: process.env.NODE_ENV === "production" ? [
          new webpack.webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.webpack.optimize.DedupePlugin(),
          new webpack.webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
          })
        ] : []
    }))
    .pipe(gulp.dest(paths.public));
});

gulp.task('server', function () {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('views', function () {
  return gulp.src(paths.views)
    .pipe(gulp.dest(paths.dist + "/server/views"));
});

gulp.task('static', function () {
  return gulp.src(paths.static)
    .pipe(gulp.dest(paths.public));
});

gulp.task('watch', function () {
  gulp.watch(paths.common, ['client', 'server']);
  gulp.watch(paths.client, ['client']);
  gulp.watch(paths.server, ['server']);
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.static, ['static']);
});

gulp.task('default', ['client', 'server', 'views', 'static', 'watch']);
