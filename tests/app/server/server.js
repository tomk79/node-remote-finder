/**
 * server.js
 */
var urlParse = require('url-parse');
var RemoteFinder = require('../../../node/main.js'),
	remoteFinder = new RemoteFinder({
		"default": require('path').resolve(__dirname, '../../data/root1/')
	}, {
		'paths_invisible': [
			'/invisibles/*',
			'*.hide'
		],
		'paths_readonly': [
			'/readonly/*',
		]
	});

var fs = require('fs');
var path = require('path');
var utils79 = require('utils79');
var express = require('express'),
	app = express();
var server = require('http').Server(app);

app.use( require('body-parser')({"limit": "1024mb"}) );
app.use( '/common/remote-finder/', express.static( path.resolve(__dirname, '../../../dist/') ) );
app.use( '/common/px2style/', express.static( path.resolve(__dirname, '../../../node_modules/px2style/dist/') ) );
app.use( '/apis/remote-finder', function(req, res, next){
	remoteFinder.gpi(req.body, function(result){
		res.status(200);
		res.set('Content-Type', 'application/json');
		res.send( JSON.stringify(result) ).end();
	});
	return;
} );

app.use( express.static( __dirname+'/../client/' ) );

// 3000番ポートでLISTEN状態にする
server.listen( 3000, function(){
	console.log('server-standby');
} );
