/*
##file_doc

@title Gulpfile
@description Config for gulp. Basically just says to take the SCSS in the directory ./sass/ and compile it down into a single CSS file in ./css/

##end
*/

'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});