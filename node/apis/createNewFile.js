/**
 * createNewFile.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var realpath = this.getRealpath(path);
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
