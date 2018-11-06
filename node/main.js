/**
 * remote-finder - main.js
 */
module.exports = function(paths_root_dir, options){
	var _this = this;
	this.paths_root_dir = paths_root_dir;
}
module.exports.prototype.getItemList = require('./apis/getItemList');

module.exports.prototype.gpi = function(input, callback){
	callback = callback || function(){};
	input = input || {};
	if( input.api == 'getItemList' ){
		this.getItemList(input.path, input.options, function(result){
			callback(result);
		});
	}else{
		callback(false);
	}
	return;
}
