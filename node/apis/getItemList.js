/**
 * getItemList.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var utils79 = require('utils79');
	var _this = this;
	var rootDir = this.paths_root_dir.default;
	var realpath = require('path').resolve(rootDir, './'+path);
	// console.log(rootDir);
	fs.readdir(realpath, {}, function(err, list){
		var rtn = [];
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
			rtn.push(item);
		}
		callback(rtn);
	});
	return;
}
