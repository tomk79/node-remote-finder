/**
 * remote-finder - main.js
 */
module.exports = function(paths_root_dir, options){
	var _this = this;
	_this.options = options || {};
	this.paths_root_dir = paths_root_dir;
}
module.exports.prototype.getItemList = require('./apis/getItemList.js');
module.exports.prototype.createNewFile = require('./apis/createNewFile.js');
module.exports.prototype.createNewFolder = require('./apis/createNewFolder.js');
module.exports.prototype.rename = require('./apis/rename.js');
module.exports.prototype.remove = require('./apis/remove.js');
module.exports.prototype.getRealpath = require('./apis/getRealpath.js');
module.exports.prototype.getResolvedPath = require('./apis/getResolvedPath.js');

module.exports.prototype.gpi = function(input, callback){
	callback = callback || function(){};
	input = input || {};
	if( this[input.api] ){
		this[input.api](input.path, input.options, function(result){
			callback(result);
		});
	}else{
		callback(false);
	}
	return;
}
