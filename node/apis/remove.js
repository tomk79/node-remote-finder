/**
 * remove.js
 */
module.exports = function(path, options, callback){
	var fsX = require('fs-extra');
	var rootDir = this.paths_root_dir.default;
	var resolvedPath = require('path').resolve('/', './'+path);
	var realpath = require('path').resolve(rootDir, './'+resolvedPath);
	// console.log(realpath);

	if( !fsX.existsSync(realpath) ){
		callback({
			result: false,
			message: "Item NOT exists."
		});
		return;
	}

	fsX.remove(realpath, function(err){
		callback({
			result: !err,
			message: (err ? 'Failed to remove file or directory. ' + path : 'OK')
		});
	});
	return;
}
