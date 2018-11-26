/**
 * rename.js
 */
module.exports = function(pathFrom, options, callback){
	var fs = require('fs');
	var pathTo = options.to;
	var rootDir = this.paths_root_dir.default;
	var resolvedPathFrom = require('path').resolve('/', './'+pathFrom);
	var realpathFrom = require('path').resolve(rootDir, './'+resolvedPathFrom);
	// console.log(realpathFrom);
	var resolvedPathTo = require('path').resolve('/', './'+pathTo);
	var realpathTo = require('path').resolve(rootDir, './'+resolvedPathTo);
	// console.log(realpathTo);

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
