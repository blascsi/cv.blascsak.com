const gulp = require('gulp');
const cleanDir = require('gulp-clean-dir');
const replace = require('gulp-replace');
const inline = require('gulp-inline');
const minifyInline = require('gulp-minify-inline');

gulp.task('copy-cname', () => {
  return gulp.src('./CNAME').pipe(gulp.dest('dist'));
});

gulp.task('copy-public', () => {
  return gulp.src('./public/**/*').pipe(gulp.dest('dist/public'));
});

gulp.task('build', () => {
  return gulp
    .src('index.html')
    .pipe(cleanDir('./dist'))
    .pipe(
      inline({
        base: '/src',
      })
    )
    .pipe(replace('../../public', 'public'))
    .pipe(minifyInline())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series(['build', 'copy-public', 'copy-cname']));
