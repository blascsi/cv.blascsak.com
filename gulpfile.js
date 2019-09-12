const gulp = require('gulp');
const cleanDir = require('gulp-clean-dir');
const inline = require('gulp-inline');
const minifyInline = require('gulp-minify-inline');

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
    .pipe(minifyInline())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series(['build', 'copy-public']));
