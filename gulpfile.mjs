import gulp from 'gulp';
// import sass from 'gulp-sass';
// const sass = require('gulp-sass')(require('sass'));
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
const sass = gulpSass(nodeSass);

import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify-es';
 const uglifyes = uglify.default;
import imagemin from 'gulp-imagemin';
import {deleteAsync} from 'del'


gulp.task('css',function(done){
    console.log('minfying css !');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

     gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();

});

gulp.task('js',function(done){
console.log('minifying js!');
    gulp.src('./assets/**/*.js')
    .pipe(uglifyes())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();

});

gulp.task('images',function(done){
    console.log('minifying images !');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();

});

// EMPTY THE PUBLIC ASSETS DIRECTORY
// whenever we are building a project we need to clear the previous build and build it from scratch
    gulp.task('clean:assets',function(done){
        deleteAsync('./public/assets');
        done();
    });

gulp.task('build',gulp.series('clean:assets', 'css', 'js', 'images'),function(done){
    console.log('Building assets !!');
    done();
});

