/**
 * saveFile.js
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

	var allow_overwrite = false;
	if( options.allow_overwrite ){
		allow_overwrite = true;
	}

	if( !allow_overwrite && fs.existsSync(realpath) ){
		callback({
			result: false,
			message: "Already exists."
		});
		return;
	}

	var bin = '';
	try {
		if(options.content){
			bin = options.content;
		}else if(options.base64){
			bin = new Buffer(options.base64, 'base64');
		}
	} catch (e) {
		bin = '';
	}

	fs.writeFile(realpath, bin, function(err){
		callback({
			result: !err,
			message: (err ? 'Failed to write file. ' + path : 'OK')
		});
	});
	return;
}
