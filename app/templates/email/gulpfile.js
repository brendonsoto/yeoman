/*!
 * gulp
 * npm install gulp-autoprefixer gulp-bootlint gulp-cache gulp-concat gulp-connect del gulp-util gulp-imagemin gulp-jshint gulp-minify-css path gulp-plumber gulp-rename gulp-replace gulp-ruby-sass through2 gulp-uglify gulp-w3c-css gulp-w3cjs --save-dev
 *
 * Console logs are used in place of the gulp-notify plugin.
 * This is because gulp-notify will throw errors if using a version of
 * Growl before 1.3 (our machines are configured with V1.2)
 */

// Load plugins
var gulp = require('gulp'),
    // autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
	connect = require('gulp-connect'),
    del = require('del'),
	// gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
	inlineCss = require('gulp-inline-css'),
	litmus = require('gulp-litmus'),
    // minifycss = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
    // rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
	w3cjs = require('gulp-w3cjs');


// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/images'], cb);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('markup', 'images', 'watch');
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'));
});

// Litmus
var config = {
	username: 'tech@thebloc.com',
	password: 'DieIEDie!',
	url: 'https://thebloc.litmus.com',
	applications: [
		'android4',
		'androidgmailapp',
		'appmail7',
		'appmail8',
		'ipadmini',
		'ipad',
		'gmailnew',
		'ffgmailnew',
		'chromegmailnew',
		'googleapps',
		'chromegoogleapps',
		'ffgoogleapps',
		'iphone5s',
		'iphone5sios8',
		'iphone6',
		'iphone6plus',
		'ol2000',
		'ol2002',
		'ol2003',
		'ol2007',
		'ol2010',
		'ol2011',
		'ol2013',
		'ol2015',
		'outlookcom',
		'ffoutlookcom',
		'chromeoutlookcom',
		'yahoo',
		'ffyahoo',
		'chromeyahoo',
		'windowsphone8'
	]
};

gulp.task('litmus', function() {
	return gulp.src('dist/index.html')
		.pipe(litmus(config));
});

// Markup
gulp.task('markup', ['styles'], function() {
	gulp.src('src/index.html')
	.pipe(w3cjs())
	.pipe(inlineCss({ preserveMediaQueries: true }))
	.pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

// Styles
gulp.task('styles', function() {
  return sass('src/stylesheets/', { style: 'expanded' })
  	.pipe(plumber())
    .pipe(gulp.dest('src/stylesheets'));
});

// Watch
gulp.task('watch', ['webserver'], function() {

	// Watch .html and .scss files
	gulp.watch(['src/*.html', 'src/stylesheets/*.scss'], ['markup']);

	// Watch image files
	gulp.watch('src/images/**/*', ['images']);
});

// Webserver
gulp.task('webserver', function() {
	connect.server({
		root: "dist",
		livereload: true
	});
});
