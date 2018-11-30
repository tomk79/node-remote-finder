/**
 * getRealpath.js (Sync)
 */
module.exports = function(path){
	var rootDir = this.paths_root_dir.default;
	var resolvedPath = this.getResolvedPath(path);
	var realpath = require('path').resolve(rootDir, '.'+resolvedPath);
	return realpath;
}
