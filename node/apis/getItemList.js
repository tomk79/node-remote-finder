/**
 * getItemList.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var posix = require('posix');
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

		list.sort();

		for(var idx in list){
			var item = {};
			item.name = list[idx];
			if(utils79.is_dir(realpath+'/'+item.name)){
				item.type = 'dir';
			}else if(utils79.is_file(realpath+'/'+item.name)){
				item.type = 'file';
			}
			item.visible = _this.isVisiblePath(path+'/'+item.name);
			if(!item.visible){
				continue;
			}
			item.writable = _this.isWritablePath(path+'/'+item.name);
			item.ext = null;
			if(item.name.match(/\.([a-zA-Z0-9\-\_]+)$/)){
				item.ext = RegExp.$1;
				item.ext = item.ext.toLowerCase();
			}
			var fileStat = fs.statSync(realpath+'/'+item.name);
			item.size = fileStat.size;
			item.mode = (fileStat.mode & parseInt(777, 8)).toString(8);

			item.uid = fileStat.uid;
			item.uname = posix.getpwnam(fileStat.uid).name;
			item.gid = fileStat.gid;
			item.gname = posix.getgrnam(fileStat.gid).name;

			rtn.list.push(item);
		}
		callback(rtn);
	});
	return;
}
