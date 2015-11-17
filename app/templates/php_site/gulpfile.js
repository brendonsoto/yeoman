/*
 * Gulp
 * npm install 
 *
 * Note for future: If the company switches to Git, include gulp-batch
 * to use with gulp-watch
 */

// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    // batch = require('gulp-batch'),
	// bootlint = require('gulp-bootlint'),
	browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
	connect = require('gulp-connect-php'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    minifycss = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
	watch = require('gulp-watch');


// Clean
gulp.task('clean', function(cb) {
    del(['dist/_assets/stylesheets', 'dist/_assets/javascript', 'dist/_assets/images'], cb);
});

// Default task
gulp.task('default', ['clean', 'init'], function() {
    gulp.start('php', 'styles', 'scripts', 'images', 'webserver', 'watch');
});

// Images
gulp.task('images', function() {
  return gulp.src('src/_assets/images/**/*')
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/_assets/images'))
    .pipe(browserSync.stream());
});

// Init - Copies basic php and slim files to get server running
gulp.task('init', function() {
	gulp.src('src/**/*.php')
	.pipe(gulp.dest('dist/'));
});

// PHP
gulp.task('php', function() {
	gulp.src('src/**/*.php')
	.pipe(watch('src/**/*.php'))
	// .pipe(bootlint())
	.pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

// Scripts 
gulp.task('scripts', function() {
	// First, copy any json files over
	gulp.src('src/_assets/javascript/**/*.json')
	.pipe(gulp.dest('dist/_assets/javascript'));

	// Now validate, compress, and copy js files
  return gulp.src('src/_assets/javascript/*.js')
	.pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/_assets/javascript'))
    .pipe(browserSync.stream({once: true}));
});

// Styles
gulp.task('styles', function() {
  return sass('src/_assets/stylesheets/', { sourcemap: true })
  	.pipe(plumber())
	.pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/_assets/stylesheets'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Watch
gulp.task('watch', function() {
    watch('src/_assets/javascript/**/*', function() {
        gulp.start('scripts');
    });
    watch('src/_assets/stylesheets/**/*.scss', function() {
        gulp.start('styles');
    });
    watch('src/**/*.php', function() {
        gulp.start('php');
    });
    watch('src/_assets/images/**/*', function() {
        gulp.start('images');
    });
});

// Webserver
gulp.task('webserver', function() {
	connect.server({ base: 'dist' }, function () {
		browserSync.init({
            proxy: "localhost:8000",
            reloadDelay: "500",
            reloadDebounce: "1000"
		});
	});
});
