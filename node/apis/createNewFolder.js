/**
 * createNewFolder.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');

	if( !this.isWritablePath( path ) ){
		callback({
			result: false,
			message: "NOT writable path."
		});
		return;
	}

	var realpath = this.getRealpath(path);
	// console.log(realpath);

	if( fs.existsSync(realpath) ){
		callback({
			result: false,
			message: "Already exists."
		});
		return;
	}

	fs.mkdir(realpath, function(err){
		callback({
			result: !err,
			message: (err ? 'Failed to mkdir. ' + path : 'OK')
		});
	});
	return;
}
