var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename');

gulp.task('default',function(){
  return gulp.src('src/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(rename({suffix:'.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'))
});
