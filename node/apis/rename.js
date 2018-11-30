/**
 * rename.js
 */
module.exports = function(pathFrom, options, callback){
	var fs = require('fs');
	var pathTo = options.to;
	var rootDir = this.paths_root_dir.default;
	var realpathFrom = this.getRealpath(pathFrom);
	// console.log(realpathFrom);
	var realpathTo = this.getRealpath(pathTo);
	// console.log(realpathTo);

	if( !this.isWritablePath( pathFrom ) ){
		callback({
			result: false,
			message: "NOT writable path."
		});
		return;
	}

	if( !this.isWritablePath( pathTo ) ){
		callback({
			result: false,
			message: "NOT writable path."
		});
		return;
	}

	if( !fs.existsSync(realpathFrom) ){
		callback({
			result: false,
			message: "File or directory NOT exists. " + pathFrom
		});
		return;
	}

	if( fs.existsSync(realpathTo) ){
		callback({
			result: false,
			message: "Already exists. " + pathTo
		});
		return;
	}

	fs.rename(realpathFrom, realpathTo, function(err){
		callback({
			result: !err,
			message: (err ? 'Failed to rename file or directory. from ' + pathFrom + ' to ' + pathTo : 'OK')
		});
	});
	return;
}
