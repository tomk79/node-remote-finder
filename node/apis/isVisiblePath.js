/**
 * isVisiblePath.js (Sync)
 */
module.exports = function(path){
	var blackList = this.options.paths_invisible;
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
