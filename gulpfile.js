var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'remote-finder.js',
	'.css.scss'
];

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass({
			"sourceComments": false
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			extname: ''
		}))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest( './dist/' ))

		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest( './dist/' ))
	;
});

// remote-finder.js (frontend) を処理
gulp.task("remote-finder.js", function() {
	gulp.src(["src/remote-finder.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('remote-finder.js'))
		.pipe(gulp.dest( './dist/' ))
		.pipe(concat('remote-finder.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"], _tasks);
});

// ブラウザを立ち上げてプレビューする
gulp.task("preview", function() {
	require('child_process').spawn('open',['http://127.0.0.1:3000/']);
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
