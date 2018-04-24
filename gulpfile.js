const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const md = require('markdown-it')()
var mila = require('markdown-it-link-attributes')

md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})


function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}


gulp.task('static', () => {
	return gulp.src('src/static/**/*')
		.pipe(gulp.dest('dist'))
})
 
gulp.task('pug', () => {
	return gulp.src('src/pages/**/*.pug')
		.pipe(pug({
			filters: {
				markdown: (input) => {
					return md.render(input)
				}
			}
		})).on('error', swallowError)
		.pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass()).on('error', swallowError)
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

gulp.task('build', ['pug', 'sass', 'static'])

gulp.task('watch', ['serve'], () => {
	gulp.watch('src/pages/**/*.pug', ['pug'])
	gulp.watch('src/content/**/*.md', ['pug'])
	gulp.watch('src/sass/**/*.scss', ['sass'])
	gulp.watch('src/static/**/*', ['static'])
})

gulp.task('default', ['build', 'watch'])
