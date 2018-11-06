(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Remote Finder
 */
window.RemoteFinder = function(elm, options){
	var _this = this;
	options = options || {};
	options.gpiBridge = options.gpiBridge || function(){};
	elm.classList.add('remote-finder');

	function gpiBridge(input, callback){
		options.gpiBridge(input, callback);
	}

	/**
	 * Finderを初期化します。
	 */
	this.init = function( path, options, callback ){
		callback = callback || function(){};
		gpiBridge(
			{
				'api': 'getItemList',
				'path': path,
				'options': options
			},
			function(result){
				elm.innerHTML = '';
				// callback(result);
				var ul = document.createElement('ul');
				if(path != '/' && path){
					var li = document.createElement('li');
					li.textContent = '../';
					li.addEventListener('click', function(){
						var tmp_path = path;
						tmp_path = tmp_path.replace(/\/(?:[\s\S]*\/?)$/, '/');
						_this.init( tmp_path );
					});
					ul.append(li);
				}
				for( var idx in result ){
					var li = document.createElement('li');
					li.textContent = result[idx].name;
					if(result[idx].type == 'dir'){
						li.textContent += '/';
						li.addEventListener('click', function(){
							_this.init( path+result[idx].name+'/' );
						});
					}
					ul.append(li);
				}
				elm.append(ul);
			}
		);
		return;
	}
}

},{}]},{},[1])