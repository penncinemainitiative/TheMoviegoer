var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var path = require('path');

var paths = {
  src: 'src/**/*.js',
  common: 'src/common/**/*.js',
  client: 'src/client/**/*.js',
  server: 'src/server/**/*.js'
};

gulp.task('client', function() {
  return gulp.src('./src/client/client.js')
    .pipe(webpack({
      entry: './src/client/client.js',
      output: {
        path: path.join(__dirname, 'public/assets'),
        filename: 'bundle.js'
      },
      devtool: 'eval',
      module: {
        loaders: [{
          test: /\.jsx?$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel'
        }]
      }
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('server', function() {
  return gulp.src([paths.src])
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.common, ['client', 'server']);
  gulp.watch(paths.client, ['client']);
  gulp.watch(paths.server, ['server']);
});

gulp.task('default', ['client', 'server', 'watch']);
