const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var beeper = require('beeper');
var gulp = require('gulp');
var sass = require('gulp-sass');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-mod-function');
var cssnano = require('cssnano');
var easyimport = require('postcss-easy-import');

function serve(done) {
	livereload.listen();
	done();
}

const handleError = (done) => {
	return function (err) {
		if (err) {
			beeper();
		}
		return done(err);
	};
};

function hbs(done) {
	pump([
		src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']),
		livereload()
	], handleError(done));
}

function css(done) {
	var processors = [
		easyimport,
		colorFunction(),
		autoprefixer(),
		cssnano()
	];

	pump([
		src('assets/css/*.css', {sourcemaps: true}),
		postcss(processors),
		dest('assets/built/', {sourcemaps: '.'}),
		livereload()
	], handleError(done));
}

function scss(done) {
	var processors = [
		easyimport,
		colorFunction(),
		autoprefixer(),
		cssnano()
	];

	return gulp.src('assets/css/styles.scss', {sourcemaps: true})
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		//.pipe(gulp.dest('assets/built/', {sourcemaps: '.'}))
		.pipe(rename('inline-styles.hbs'))
		.pipe(gulp.dest('partials/compiled/'))
		.pipe(livereload());
}

function js(done) {
	pump([
		src([
			'assets/js/lib/jquery.min.js',
			'assets/js/lib/*.js'
		], {sourcemaps: true}),
		concat('libs.js'),
		uglify(),
		dest('assets/built/', {sourcemaps: '.'}),
		livereload()
	], handleError(done));

	pump([
		src([
			'assets/js/post-lib/*.js'
		], {sourcemaps: true}),
		concat('post-libs.js'),
		uglify(),
		dest('assets/built/', {sourcemaps: '.'}),
		livereload()
	], handleError(done));

	pump([
		src('assets/js/*.js', {sourcemaps: true}),
		// uglify(),
		dest('assets/built/', {sourcemaps: '.'}),
		livereload()
	], handleError(done));

	pump([
		src('assets/js/post.js', {sourcemaps: true}),
		uglify(),
		dest('assets/built/', {sourcemaps: '.'}),
		livereload()
	], handleError(done));
}

function zipper(done) {
	var targetDir = 'dist/';
	var themeName = require('./package.json').name;
	var filename = themeName + '.zip';

	pump([
		src([
			'**',
			'!node_modules', '!node_modules/**',
			'!dist', '!dist/**'
		]),
		zip(filename),
		dest(targetDir)
	], handleError(done));
}

const cssWatcher = () => watch('assets/css/**', css);
const scssWatcher = () => watch(['assets/css/**/*.css', 'assets/css/**/*.scss'], scss);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const jsWatcher = () => watch(['assets/js/*.js', 'assets/js/lib/*.js', 'assets/js/post-lib/*.js'], js);
const watcher = parallel(scssWatcher, hbsWatcher, jsWatcher);
const build = series(scss, js);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
