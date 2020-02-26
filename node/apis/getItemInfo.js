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
		itemInfo: {}
	};

	var item = {};
	item.name = utils79.basename(realpath);
	if(utils79.is_dir(realpath+'/'+item.name)){
		item.type = 'dir';
	}else if(utils79.is_file(realpath+'/'+item.name)){
		item.type = 'file';
	}
	item.visible = _this.isVisiblePath(path+'/'+item.name);
	if(!item.visible){
		return {
			result: true,
			message: "Item Not Found",
			itemInfo: false
		};
	}
	item.writable = _this.isWritablePath(path+'/'+item.name);
	item.ext = null;
	if(item.name.match(/\.([a-zA-Z0-9\-\_]+)$/)){
		item.ext = RegExp.$1;
		item.ext = item.ext.toLowerCase();
	}
	var bin = fs.readFileSync(realpath).toString();
	item.size = fs.statSync(realpath).size;
	item.md5 = utils79.md5(bin);
	item.base64 = utils79.base64_encode(bin);
	item.mime = mimeTypes.lookup(realpath);

	rtn.itemInfo = item;
	callback(rtn);

	return;
}
