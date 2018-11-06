/**
 * server.js
 */
var urlParse = require('url-parse');
var RemoteFinder = require('../../../node/main.js'),
	remoteFinder = new RemoteFinder({
		"default": require('path').resolve(__dirname, '../client/')
	});

var fs = require('fs');
var path = require('path');
var utils79 = require('utils79');
var express = require('express'),
	app = express();
var server = require('http').Server(app);

app.use( require('body-parser')({"limit": "1024mb"}) );
app.use( '/common/remote-finder/', express.static( path.resolve(__dirname, '../../../dist/') ) );
app.use( '/apis/remote-finder', function(req, res, next){
	// console.log(req);
	// console.log(req.method);
	// console.log(req.body);
	// console.log(req.originalUrl);
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
