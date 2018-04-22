const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()


gulp.task('pug', () => {
	return gulp.src('src/pages/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    open: false
  })
})

gulp.task('build', ['pug', 'sass'])

gulp.task('watch', ['serve'], () => {
	gulp.watch('src/pages/**/*.pug', ['pug'])
	gulp.watch('src/content/**/*.md', ['pug'])
	gulp.watch('src/sass/**/*.scss', ['sass'])
})

gulp.task('default', ['build', 'watch'])
