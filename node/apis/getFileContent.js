/**
 * getItemInfo.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var mimeTypes = require('mime-types');
	var utils79 = require('utils79');
	var _this = this;
	var realpath = this.getRealpath(path);
	// console.log(rootDir);
	var rtn = {
		result: true,
		message: "OK",
		content: {}
	};

	var item = {};
	item.name = utils79.basename(realpath);
	item.type = null;
	item.size = 0;
	if(utils79.is_dir(realpath)){
		item.type = 'dir';
	}else if(utils79.is_file(realpath)){
		item.type = 'file';
		item.size = fs.statSync(realpath).size;
	}

	if( !_this.isVisiblePath(path) ){
		callback({
			result: false,
			message: "Item not found",
			content: false
		});
		return;
	}
	if(item.type != 'file'){
		callback({
			result: false,
			message: "Item is not a file",
			content: false
		});
		return;
	}
	if(item.size > (30 * 1000 * 1000)){
		callback({
			result: false,
			message: "Item is too large ("+(item.size)+"bytes)",
			content: false,
		});
		return;
	}

	item.ext = null;
	if(item.name.match(/\.([a-zA-Z0-9\-\_]+)$/)){
		item.ext = RegExp.$1;
		item.ext = item.ext.toLowerCase();
	}
	var bin = fs.readFileSync(realpath);
	item.md5 = utils79.md5(bin);
	item.base64 = utils79.base64_encode(bin);
	item.mime = mimeTypes.lookup(realpath);

	rtn.content = item;
	callback(rtn);

	return;
}
