var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

gulp.task('less', function() {
  gulp.src('static/less/general.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
  gulp.src('static/js/*.js')
    .pipe(concat('page.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch('static/less/*.less', ['less']);
  gulp.watch('static/js/*.js', ['js']);
});

gulp.task('default', function(callback) {
  runSequence('less', 'js', callback);
});