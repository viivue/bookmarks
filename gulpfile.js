const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('serve', function(){
    gulp.watch('**').on('change', () => {
        browserSync.reload();
    });

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});