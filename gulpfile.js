var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var path = require('path');

var paths = {
  src: 'src/**/*.js',
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
      devtool: 'inline-source-map',
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
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['client', 'server']);
});

gulp.task('default', ['client', 'server', 'watch']);
