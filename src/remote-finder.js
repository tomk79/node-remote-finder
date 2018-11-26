/**
 * Remote Finder
 */
window.RemoteFinder = function($elm, options){
	var _this = this;
	var current_dir = '/';
	options = options || {};
	options.gpiBridge = options.gpiBridge || function(){};
	options.open = options.open || function(pathinfo, callback){
		callback();
	};
	options.mkdir = options.mkdir || function(current_dir, callback){
		var foldername = prompt('Folder name:');
		if( !foldername ){ return; }
		callback( foldername );
		return;
	};
	options.mkfile = options.mkfile || function(current_dir, callback){
		var filename = prompt('File name:');
		if( !filename ){ return; }
		callback( filename );
		return;
	};
	options.rename = options.rename || function(renameFrom, callback){
		var renameTo = prompt('Rename from '+renameFrom+' to:', renameFrom);
		callback( renameFrom, renameTo );
		return;
	};
	options.remove = options.remove || function(path_target, callback){
		callback();
		return;
	};
	$elm.classList.add('remote-finder');

	/**
	 * サーバーサイドスクリプトに問い合わせる
	 */
	function gpiBridge(input, callback){
		options.gpiBridge(input, callback);
	}

	/**
	 * ファイルを開く
	 */
	this.open = function(path, callback){
		var ext = null;
		try{
			if( path.match(/^[\s\S]*\.([\s\S]+?)$/) ){
				ext = RegExp.$1.toLowerCase();
			}
		}catch(e){}

		var pathinfo = {
			'path': path,
			'ext': ext
		};
		options.open(pathinfo, function(isCompeted){
			if( isCompeted ){
				return;
			}
			callback(isCompeted);
		});
	}

	/**
	 * フォルダを作成する
	 */
	this.mkdir = function(current_dir, callback){
		options.mkdir(current_dir, function(foldername){
			if( !foldername ){
				return;
			}
			callback(foldername);
			return;
		});
	}

	/**
	 * ファイルを作成する
	 */
	this.mkfile = function(current_dir, callback){
		options.mkfile(current_dir, function(filename){
			if( !filename ){
				return;
			}
			callback(filename);
			return;
		});
	}

	/**
	 * ファイルやフォルダの名前を変更する
	 */
	this.rename = function(renameFrom, callback){
		options.rename(renameFrom, function(renameFrom, renameTo){
			if( !renameTo ){ return; }
			if( renameTo == renameFrom ){ return; }
			gpiBridge(
				{
					'api': 'rename',
					'path': renameFrom,
					'options': {
						'to': renameTo
					}
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					callback();
				}
			);
			return;
		});
	}

	/**
	 * ファイルやフォルダを削除する
	 */
	this.remove = function(path_target, callback){
		options.remove(path_target, function(){
			callback();
			return;
		});
	}

	/**
	 * カレントディレクトリを得る
	 */
	this.getCurrentDir = function(){
		return current_dir;
	}

	/**
	 * Finderを初期化します。
	 */
	this.init = function( path, options, callback ){
		current_dir = path;
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

				// create new file or folder
				var $li = document.createElement('li');
				var $a = document.createElement('a');
				$a.textContent = 'new Folder';
				$a.href = 'javascript:;';
				$a.addEventListener('click', function(){
					_this.mkdir(path, function(foldername){
						if( !foldername ){ return; }
						gpiBridge(
							{
								'api': 'createNewFolder',
								'path': path+foldername
							},
							function(result){
								if(!result.result){
									alert(result.message);
								}
								_this.init( path );
							}
						);
					});
				});
				$li.append($a);
				$ul.append($li);

				var $li = document.createElement('li');
				var $a = document.createElement('a');
				$a.textContent = 'new File';
				$a.href = 'javascript:;';
				$a.addEventListener('click', function(){
					_this.mkfile(path, function(filename){
						if( !filename ){ return; }
						gpiBridge(
							{
								'api': 'createNewFile',
								'path': path+filename
							},
							function(result){
								if(!result.result){
									alert(result.message);
								}
								_this.init( path );
							}
						);
					});
				});
				$li.append($a);
				$ul.append($li);


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


				// contained file and folders
				for( var idx in result ){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = result[idx].name;
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', result[idx].name);
					$a.setAttribute('data-path', path + result[idx].name);
					$submenu = document.createElement('ul');
					$submenu.classList.add('remote-finder__file-list-submenu');
					if(result[idx].type == 'dir'){
						$a.textContent += '/';
						$a.addEventListener('click', function(e){
							var filename = this.getAttribute('data-filename');
							_this.init( path+filename+'/' );
						});

					}else if(result[idx].type == 'file'){
						$a.addEventListener('click', function(e){
							var path = this.getAttribute('data-path');
							_this.open( path, function(res){} );
						});
					}

					$menu = document.createElement('button');
					$menu.textContent = 'rename';
					$menu.setAttribute('data-filename', result[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
						_this.rename(path+filename, function(){
							_this.init( path );
						});
					});
					$submenuLi = document.createElement('li');
					$submenuLi.append($menu);
					$submenu.append($submenuLi);

					$menu = document.createElement('button');
					$menu.textContent = 'delete';
					$menu.setAttribute('data-filename', result[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
						_this.remove(path+filename, function(){
							gpiBridge(
								{
									'api': 'remove',
									'path': path+filename
								},
								function(result){
									if(!result.result){
										alert(result.message);
									}
									_this.init( path );
								}
							);
						});
					});
					$submenuLi = document.createElement('li');
					$submenuLi.append($menu);
					$submenu.append($submenuLi);

					$a.append($submenu);
					$li.append($a);
					$ul.append($li);
				}
				$elm.append($ul);
			}
		);
		return;
	}
}
