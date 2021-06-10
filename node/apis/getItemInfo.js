/**
 * getItemInfo.js
 */
module.exports = function(path, options, callback){
	var fs = require('fs');
	var posix = require('posix');
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
	if(utils79.is_dir(realpath)){
		item.type = 'dir';
	}else if(utils79.is_file(realpath)){
		item.type = 'file';
	}
	item.visible = _this.isVisiblePath(path);
	if(!item.visible){
		callback({
			result: false,
			message: "Item not found",
			content: false
		});
		return;
	}
	item.writable = _this.isWritablePath(path);

	var fileStat = fs.statSync(realpath);
	item.size = fileStat.size;
	item.mode = (fileStat.mode & parseInt(777, 8)).toString(8);
	item.uid = fileStat.uid;
	item.uname = fileStat.uid;
	// item.uname = posix.getpwnam(fileStat.uid).name; // TODO: nw で問題が起きるためひとまず見送り
	item.gid = fileStat.gid;
	item.gname = fileStat.gid;
	// item.gname = posix.getgrnam(fileStat.gid).name; // TODO: nw で問題が起きるためひとまず見送り

	if( item.type == 'file' ){
		item.ext = null;
		if(item.name.match(/\.([a-zA-Z0-9\-\_]+)$/)){
			item.ext = RegExp.$1;
			item.ext = item.ext.toLowerCase();
		}
		var bin = fs.readFileSync(realpath);

		item.md5 = utils79.md5(bin);
		item.mime = mimeTypes.lookup(realpath);

		// プレビューに使う情報を整理
		item.preview = {
			'mime': null,
			'ext': null,
			'base64': null,
		};
		if( item.size == 0 ){
			// 内容がからっぽの場合
			item.preview = {
				'mime': 'text/plain',
				'ext': 'txt',
				'base64': utils79.base64_encode(''),
			};
		}else if( item.size < 1000000 && item.mime && item.mime.match(/^image\//i) ){
			// 軽量な画像ファイルの場合
			item.preview = {
				'mime': item.mime,
				'ext': item.ext,
				'base64': utils79.base64_encode(bin),
			};
		}else if( item.size < 1000000 && item.mime && item.mime.match(/^text\//i) ){
			// 軽量なテキストファイルの場合
			item.preview = {
				'mime': item.mime,
				'ext': item.ext,
				'base64': utils79.base64_encode(bin),
			};
		}
	}

	rtn.itemInfo = item;
	callback(rtn);

	return;
}
