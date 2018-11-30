/**
 * remove.js
 */
module.exports = function(path, options, callback){
	var fsX = require('fs-extra');
	var realpath = this.getRealpath(path);
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
