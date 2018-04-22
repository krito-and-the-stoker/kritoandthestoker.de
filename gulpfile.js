const gulp = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create();


gulp.task('build', () => {
	return gulp.src('src/pages/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

gulp.task('watch', ['serve'], () => {
	gulp.watch('src/pages/**/*.pug', ['build'])
})

gulp.task('default', ['watch'])
