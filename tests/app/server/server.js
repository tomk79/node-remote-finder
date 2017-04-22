/**
 * server.js
 */
var urlParse = require('url-parse');

var fs = require('fs');
var path = require('path');
var utils79 = require('utils79');
var express = require('express'),
	app = express();
var server = require('http').Server(app);

app.use( require('body-parser')({"limit": "1024mb"}) );
app.use( '/common/', express.static( path.resolve(__dirname, '../../../dist/') ) );

app.use( express.static( __dirname+'/../client/' ) );

// 3000番ポートでLISTEN状態にする
server.listen( 3000, function(){
	console.log('server-standby');
} );
