var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

gulp.task('less', function() {
  gulp.src('static/less/general.less')
    .pipe(less())
    .pipe(cssnano({
      zindex: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
  gulp.src(['static/js/*.js', '!static/js/fbSDK.js'])
    .pipe(concat('page.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
  gulp.src('static/js/fbSDK.js')
    .pipe(gulp.dest('public/js'));
});

gulp.task('jsx', function() {
  gulp.src('views/*.jsx')
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(gulp.dest('public/views'));
});

gulp.task('static', function() {
  gulp.src('static/fonts/*')
    .pipe(gulp.dest('public/fonts'));
  gulp.src('static/images/*')
    .pipe(gulp.dest('public/images'));
});

gulp.task('watch', function() {
  gulp.watch('static/less/*.less', ['less']);
  gulp.watch('static/js/*.js', ['js']);
  gulp.watch('views/*.jsx', ['jsx']);
});

gulp.task('default', function(callback) {
  runSequence('static', 'less', 'js', 'jsx', callback);
});