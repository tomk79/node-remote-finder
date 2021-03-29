/**
 * remote-finder - main.js
 */
module.exports = function(paths_root_dir, options){
	var _this = this;
	options = options || {};
	options.paths_readonly = options.paths_readonly || [];
	options.paths_invisible = options.paths_invisible || [];
	_this.options = options;
	this.paths_root_dir = paths_root_dir;
}
module.exports.prototype.gpi_getItemInfo = require('./apis/getItemInfo.js');
module.exports.prototype.gpi_getFileContent = require('./apis/getFileContent.js');
module.exports.prototype.gpi_getItemList = require('./apis/getItemList.js');
module.exports.prototype.gpi_createNewFile = require('./apis/createNewFile.js');
module.exports.prototype.gpi_createNewFolder = require('./apis/createNewFolder.js');
module.exports.prototype.gpi_saveFile = require('./apis/saveFile.js');
module.exports.prototype.gpi_copy = require('./apis/copy.js');
module.exports.prototype.gpi_rename = require('./apis/rename.js');
module.exports.prototype.gpi_remove = require('./apis/remove.js');
module.exports.prototype.getRealpath = require('./apis/getRealpath.js');
module.exports.prototype.getResolvedPath = require('./apis/getResolvedPath.js');
module.exports.prototype.isVisiblePath = require('./apis/isVisiblePath.js');
module.exports.prototype.isWritablePath = require('./apis/isWritablePath.js');

module.exports.prototype.gpi = function(input, callback){
	callback = callback || function(){};
	input = input || {};

	try{
		if( input.api.match(/[^a-zA-Z0-9]/g) ){
			callback({
				result: false,
				message: '"'+input.api+'" is an invalid API name.'
			});
			return;
		}

		if( this['gpi_'+input.api] ){
			this['gpi_'+input.api](input.path, input.options, function(result){
				callback(result);
			});
			return;
		}

		callback({
			result: false,
			message: 'An API "'+input.api+'" is undefined, or not callable.'
		});
		return;
	}catch(e){
		console.error(e);
		callback({
			result: false,
			message: 'Unknown Error.'
		});
		return;
	}
	return;
}
