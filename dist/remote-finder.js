(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Remote Finder
 */
window.RemoteFinder = function($elm, options){
	var _this = this;
	options = options || {};
	options.gpiBridge = options.gpiBridge || function(){};
	$elm.classList.add('remote-finder');

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
				$elm.innerHTML = '';
				// callback(result);
				var $ul = document.createElement('ul');
				$ul.classList.add('remote-finder__file-list');

				// parent directory
				if(path != '/' && path){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = '../';
					$a.href = 'javascript:;';
					$a.addEventListener('click', function(){
						var tmp_path = path;
						tmp_path = tmp_path.replace(/\/(?:[^\/]*\/?)$/, '/');
						_this.init( tmp_path );
					});
					$li.append($a);
					$ul.append($li);
				}

				// create new file or folder
				var $li = document.createElement('li');
				var $a = document.createElement('a');
				$a.textContent = 'new Folder';
				$a.href = 'javascript:;';
				$a.addEventListener('click', function(){
					var foldername = prompt('Folder name:');
					if( !foldername ){ return; }
					gpiBridge(
						{
							'api': 'createNewFolder',
							'path': path+foldername,
							'options': {}
						},
						function(result){
							if(!result.result){
								alert(result.message);
							}
							_this.init( path );
						}
					);
				});
				$li.append($a);
				$ul.append($li);

				var $li = document.createElement('li');
				var $a = document.createElement('a');
				$a.textContent = 'new File';
				$a.href = 'javascript:;';
				$a.addEventListener('click', function(){
					var filename = prompt('File name:');
					if( !filename ){ return; }
					gpiBridge(
						{
							'api': 'createNewFile',
							'path': path+filename,
							'options': {}
						},
						function(result){
							if(!result.result){
								alert(result.message);
							}
							_this.init( path );
						}
					);
				});
				$li.append($a);
				$ul.append($li);

				// contained file and folders
				for( var idx in result ){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = result[idx].name;
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', result[idx].name);
					if(result[idx].type == 'dir'){
						$a.textContent += '/';
						$a.addEventListener('click', function(){
							var filename = this.getAttribute('data-filename');
							_this.init( path+filename+'/' );
						});
					}else if(result[idx].type == 'file'){
						$a.addEventListener('click', function(){
							alert('開発中');
						});
					}
					$li.append($a);
					$ul.append($li);
				}
				$elm.append($ul);
			}
		);
		return;
	}
}

},{}]},{},[1])