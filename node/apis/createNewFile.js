/**
 * createNewFile.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var rootDir = this.paths_root_dir.default;
	var resolvedPath = require('path').resolve('/', './'+path);
	var realpath = require('path').resolve(rootDir, './'+resolvedPath);
	// console.log(realpath);

	if( fs.existsSync(realpath) ){
		callback({
			result: false,
			message: "Already exists."
		});
		return;
	}

	fs.writeFile(realpath, '', function(err){
		callback({
			result: !err,
			message: (err ? 'Failed to write file. ' + path : 'OK')
		});
	});
	return;
}
