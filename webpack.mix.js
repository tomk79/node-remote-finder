const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.webpackConfig({
		module: {
			rules:[
				{
					test: /\.txt$/i,
					use: ['raw-loader'],
				},
				{
					test: /\.csv$/i,
					loader: 'csv-loader',
					options: {
						dynamicTyping: true,
						header: false,
						skipEmptyLines: false,
					},
				},
				{
					test:/\.twig$/,
					use:['twig-loader']
				},
				{
					test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
					type: "asset/inline"
				},
				{
					test: /\.jsx$/,
					exclude: /(node_modules|bower_components)/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-react',
								'@babel/preset-env'
							]
						}
					}]
				}
			]
		},
		resolve: {
			fallback: {
				"fs": false,
				"path": false,
				"crypto": false,
				"stream": false,
			}
		}
	})


	// --------------------------------------
	// Remote Finder
	.js('src/remote-finder.js', 'dist/')
	.js('src/remote-finder.bundled.js', 'dist/')
	.sass('src/remote-finder.scss', 'dist/')
	.sass('src/remote-finder.bundled.scss', 'dist/')
	.sass('src/themes/default.scss', 'dist/themes/')
	.sass('src/themes/default.bundled.scss', 'dist/themes/')
	.sass('src/themes/lightmode.scss', 'dist/themes/')
	.sass('src/themes/lightmode.bundled.scss', 'dist/themes/')
	.sass('src/themes/darkmode.scss', 'dist/themes/')
	.sass('src/themes/darkmode.bundled.scss', 'dist/themes/')
;
