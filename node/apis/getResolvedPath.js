/**
 * getResolvedPath.js (Sync)
 */
module.exports = function(path){
	var resolvedPath = path;
	resolvedPath = resolvedPath.replace(/^[A-Z]\:+/i, '');
	resolvedPath = require('path').resolve('/', path);
	resolvedPath = path.split(/[\/\\]/).join('/');
	resolvedPath = resolvedPath.replace(/^[A-Z]\:+/i, '');
	resolvedPath = require('path').resolve('/', './'+resolvedPath);
	resolvedPath = resolvedPath.replace(/^[^\/\\]+/, '');
	resolvedPath = resolvedPath.split(/[\/\\]/).join('/');
	return resolvedPath;
}
