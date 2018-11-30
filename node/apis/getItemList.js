/**
 * getItemList.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var utils79 = require('utils79');
	var _this = this;
	var realpath = this.getRealpath(path);
	// console.log(rootDir);
	var rtn = {
		result: true,
		message: "OK",
		list: []
	};
	fs.readdir(realpath, {}, function(err, list){
		if(err){
			rtn.result = false;
			rtn.message = 'Failed to read directory.';
			callback(rtn);
			return;
		}
		for(var idx in list){
			var item = {};
			item.name = list[idx];
			if(utils79.is_dir(realpath+'/'+item.name)){
				item.type = 'dir';
			}else if(utils79.is_file(realpath+'/'+item.name)){
				item.type = 'file';
			}
			item.ext = null;
			if(item.name.match(/\.([a-zA-Z0-9\-\_]+)$/)){
				item.ext = RegExp.$1;
				item.ext = item.ext.toLowerCase();
			}
			rtn.list.push(item);
		}
		callback(rtn);
	});
	return;
}
