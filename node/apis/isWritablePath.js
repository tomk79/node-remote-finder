/**
 * isWritablePath.js (Sync)
 */
module.exports = function(path){
	if( !this.isVisiblePath(path) ){
		// 見えないパスは書き込みもできないべき。
		return false;
	}
	var blackList = this.options.paths_readonly;
	var escp = [
		'(', ')', '[', ']', '{', '}',
		'^', '$', '+'
	];
	for(var i in blackList){
		var ptn = blackList[i];
		for(var i2 in escp){
			ptn = ptn.split(escp[i2]).join('\\'+escp[i2]);
		}
		ptn = ptn.split(/\*/).join('[\\s\\S]*');
		ptn = '^'+ptn+'$';
		if( path.match( new RegExp(ptn) ) ){
			return false;
		}
	}
	return true;
}
