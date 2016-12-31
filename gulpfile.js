const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');

var spawn = require('child_process').spawn, node;

function runServer() {
  if (node) node.kill();
  node = spawn('node', ['dist/server/server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
}

process.on('exit', function() {
  if (node) node.kill()
});

const paths = {
  src: 'src/**/*.js',
  common: 'src/common/**/*.js',
  server: 'src/server/**/*.js',
  views: 'views/**/*',
  static: 'static/**/*',
  public: 'public',
  dist: 'dist'
};

gulp.task('server', function () {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))
    .on('end', runServer);
});

gulp.task('prod-server', function() {
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
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.static, ['static']);
  gulp.watch([paths.common, paths.server], ['server']);
});

gulp.task('default', ['views', 'static', 'watch', 'server']);