const gulp = require('gulp')
const less = require('gulp-less')
const path = require('path')
const lessFile = './src/less/*.less'


gulp.task('less', function () {
    return gulp.src(lessFile)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .on('error', function (err) {
            console.log(err.toString())
            this.emit('end')
        })
        .pipe(gulp.dest('./src/css/'))
})

gulp.task('watch', function () {
    gulp.watch(lessFile, ['less']).on('error', err => console.log(err.toString()))
})

gulp.task('default', ['watch', 'less'])
