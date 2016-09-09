const SRC_PATH = './app/';
const ASSETS_PATH = './dist/';

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    imagemin = require('gulp-imagemin'),
    prettify = require('gulp-prettify'),
    bower = require('gulp-main-bower-files'),
    cache = require('gulp-cache'),
    rev = require('gulp-rev'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    watch = require('gulp-watch'),
    dedupe = require('gulp-dedupe'),
    batch = require('gulp-batch');

gulp.task('build', ['clean', 'watch'], function () {
    gulp.start('bower', 'scripts', 'pug', 'img', 'fonts');
});

/**
 * Compile pug templates
 */
gulp.task('pug', function () {
    var YOUR_LOCALS = {};

    return gulp.src(SRC_PATH + 'pug/**/*.pug')
        .pipe(plumber())
        .pipe(pug({locals: YOUR_LOCALS}))
        .pipe(prettify({indent_size: 4}))
        .pipe(gulp.dest(ASSETS_PATH));
});

/**
 * Optimize all images
 */
gulp.task('img', function () {
    return gulp.src(SRC_PATH + 'img/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest(ASSETS_PATH + 'images'))
});

/**
 * Copy all fonts
 */
gulp.task('fonts', function () {
    //gulp.src(SRC_PATH + 'fonts/**/*.{ttf,woff,woff2,eof,svg}')
    //    .pipe(plumber())
    //    .pipe(gulp.dest(ASSETS_PATH + 'fonts'));
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
            .pipe(gulp.dest(ASSETS_PATH + 'fonts'));
    //gulp.src('./bower_components/bootstrap/dist/fonts/!**/!*.{ttf,woff,eof,svg}*')
    //        .pipe(gulp.dest(ASSETS_PATH + 'fonts'));

});

/**
 * Compile all js
 */
gulp.task('jshint', function () {
    return gulp.src(SRC_PATH + 'scripts/**/*.js')
});

gulp.task('scripts', ['jshint'], function () {
    return gulp.src(SRC_PATH + 'scripts/**/*.js')
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(ngAnnotate({add: true}))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(ASSETS_PATH + 'js'));
});

/**
 * Cleanup all dirs
 */
gulp.task('clean', function () {
    return gulp.src([ASSETS_PATH] + '*', {read: false})
        .pipe(plumber())
        .pipe(rimraf({force: true}));
});

/**
 * Watch all files
 */
gulp.task('watch',
    [
        'watch.img',
        'watch.pug',
        'watch.fonts',
        'watch.scripts'
    ]
);

/**;
 * Watch pug
 */
gulp.task('watch.pug', function () {
    watch(SRC_PATH + 'pug/**/*.pug', batch(function (events, done) {
        gulp.start('pug', done);
    }));
});

/**
 * Watch img
 */
gulp.task('watch.img', function () {
    watch(SRC_PATH + 'img/**/*', batch(function (events, done) {
        gulp.start('img', done);
    }));
});

/**
 * Watch fonts
 */
gulp.task('watch.fonts', function () {
    watch(SRC_PATH + 'fonts/**/*.{ttf,woff,eof,svg}', batch(function (events, done) {
        gulp.start('fonts', done);
    }));
});

/**
 * Watch scripts
 */
gulp.task('watch.scripts', function () {
    watch(SRC_PATH + 'scripts/**/*', batch(function (events, done) {
        gulp.start('scripts', done);
    }));
});

/**
 * Build bower
 */
gulp.task('bower', function () {
    var jsFilter    = filter('**/*.js', {restore: true});

    return gulp.src('./bower.json')
        .pipe(bower({
            paths: './'
        }))
        .pipe(jsFilter)
        .pipe(dedupe())
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(ASSETS_PATH + 'js'))
        .pipe(jsFilter.restore)
});


