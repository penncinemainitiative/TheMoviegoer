const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

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
  fonts: 'static/fonts/**/*',
  images: 'static/images/**/*',
  js: 'static/js/**/*',
  sass: 'static/sass/**/*',
  public: 'public',
  dist: 'dist'
};

gulp.task('server', function () {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))
    .on('end', runServer);
});

gulp.task('build-server', function() {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('views', function () {
  return gulp.src(paths.views)
    .pipe(gulp.dest(paths.dist + "/server/views"));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.public + "/js"));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.public + "/images"));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.public + "/fonts"));
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(cleanCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(paths.public + "/css"));
});

gulp.task('watch', function () {
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.static, ['static']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch([paths.common, paths.server], ['server']);
});

gulp.task('static', ['js', 'images', 'fonts', 'sass']);

gulp.task('prod-server', ['views', 'static', 'build-server']);

gulp.task('default', ['views', 'static', 'watch', 'server']);