/**
 * Remote Finder
 */
window.RemoteFinder = function($elm, options){
	var _this = this;
	var $ = require('jquery')
	var current_dir = '/';
	var filter = '';
	var $pathBar;
	var $fileList;

	var templates = {
		'modal': require('./templates.ignore/modal.html')
	};
	var Modal = require('./funcs.ignore/modal.js');
	this.modal = new Modal(this, $elm, templates.modal);

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
	options.copy = options.copy || function(copyFrom, callback){
		var copyTo = prompt('Copy from '+copyFrom+' to:', copyFrom);
		callback( copyFrom, copyTo );
		return;
	};
	options.rename = options.rename || function(renameFrom, callback){
		var renameTo = prompt('Rename from '+renameFrom+' to:', renameFrom);
		callback( renameFrom, renameTo );
		return;
	};
	options.remove = options.remove || function(path_target, callback){
		if( !confirm('Really?') ){
			return;
		}
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
			gpiBridge(
				{
					'api': 'createNewFolder',
					'path': current_dir+foldername
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
	 * ファイルを作成する
	 */
	this.mkfile = function(current_dir, callback){
		options.mkfile(current_dir, function(filename){
			if( !filename ){
				return;
			}
			gpiBridge(
				{
					'api': 'createNewFile',
					'path': current_dir+filename
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
	 * ファイルやフォルダを複製する
	 */
	this.copy = function(copyFrom, callback){
		options.copy(copyFrom, function(copyFrom, copyTo){
			if( !copyTo ){ return; }
			if( copyTo == copyFrom ){ return; }
			gpiBridge(
				{
					'api': 'copy',
					'path': copyFrom,
					'options': {
						'to': copyTo
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
			gpiBridge(
				{
					'api': 'remove',
					'path': path_target
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
	 * カレントディレクトリを得る
	 */
	this.getCurrentDir = function(){
		return current_dir;
	}

	/**
	 * カレントディレクトリをセットする
	 */
	this.setCurrentDir = function(path, callback){
		current_dir = path;
		callback = callback || function(){};
		gpiBridge(
			{
				'api': 'getItemList',
				'path': path,
				'options': options
			},
			function(result){
				if( !result.result ){
					alert( result.message );
					return;
				}

				// --------------------------------------
				// Path Bar
				$pathBar.innerHTML = '';
				var tmpCurrentPath = '';
				var tmpZIndex = 10000;
				var breadcrumb = path.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
				var $li = document.createElement('li');
				$li.style.zIndex = tmpZIndex;tmpZIndex --;
				var $a = document.createElement('a');
				$a.textContent = '/';
				$a.href = 'javascript:;';
				$a.addEventListener('click', function(){
					_this.setCurrentDir( '/' );
				});
				$li.append($a);
				$pathBar.append($li);
				for(var i = 0; i < breadcrumb.length; i ++){
					if( !breadcrumb[i].length ){
						continue;
					}
					var $li = document.createElement('li');
					$li.style.zIndex = tmpZIndex;tmpZIndex --;
					var $a = document.createElement('a');
					$a.textContent = breadcrumb[i];
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', breadcrumb[i]);
					$a.setAttribute('data-path', '/' + tmpCurrentPath + breadcrumb[i] + '/');
					$a.addEventListener('click', function(){
						var targetPath = this.getAttribute('data-path');
						_this.setCurrentDir( targetPath );
					});
					$li.append($a);
					$pathBar.append($li);
					tmpCurrentPath += breadcrumb[i] + '/';
				}

				$elm.append($pathBar);

				// --------------------------------------
				// File list
				$fileList.innerHTML = '';

				// parent directory
				if(path != '/' && path){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = '../';
					$a.href = 'javascript:;';
					$a.addEventListener('click', function(){
						var tmp_path = path;
						tmp_path = tmp_path.replace(/\/(?:[^\/]*\/?)$/, '/');
						_this.setCurrentDir( tmp_path );
					});
					$li.append($a);
					$fileList.append($li);
				}


				// contained file and folders
				for( var idx in result.list ){
					if( filter.length && result.list[idx].type == 'file' ){
						if( result.list[idx].name.split(filter).length < 2 ){
							continue;
						}
					}

					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = result.list[idx].name;
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', result.list[idx].name);
					$a.setAttribute('data-path', path + result.list[idx].name);
					$submenu = document.createElement('ul');
					$submenu.classList.add('remote-finder__file-list-submenu');
					if(result.list[idx].type == 'dir'){
						$a.textContent += '/';
						$a.classList.add('remote-finder__ico-folder');
						$a.addEventListener('click', function(e){
							var filename = this.getAttribute('data-filename');
							_this.setCurrentDir( path+filename+'/' );
						});

					}else if(result.list[idx].type == 'file'){
						$a.classList.add('remote-finder__ico-file');
						$a.addEventListener('click', function(e){
							var path = this.getAttribute('data-path');
							var filename = this.getAttribute('data-filename');
							var $body = $('<div>');
							_this.modal.open({
								'title': filename,
								'body': $body,
								'btns': [
									{
										'label': 'Open this file',
										'class': 'remote-finder__btn remote-finder__btn-primary',
										'click': function(){
											_this.open( path, function(res){} );
										}
									},
									{
										'label': 'OK',
										'class': 'remote-finder__btn',
										'click': function(){
											_this.modal.close();
										}
									}
								]
							});
							gpiBridge(
								{
									'api': 'getItemInfo',
									'path': path,
									'options': {}
								},
								function(result){
									var item = result.itemInfo;
									console.log(result);
									var $preview = $('<div class="remote-finder__preview">');
									switch(item.ext){
										case 'html': case 'htm':
										case 'js': case 'json':
										case 'css': case 'scss':
										case 'md':
										case 'mm':
										case 'txt':
										case 'svg':
											$preview.append( $('<pre>').append( $('<code>').text( decodeURIComponent(escape(atob(item.base64))) ) ) );
											break;
										case 'jpg': case 'jpeg': case 'jpe':
										case 'png': case 'gif':
											$preview.append( $('<img>').attr({
												'src': 'data:'+item.mime+';base64,'+item.base64
											}) );
											break;
										default:
											$preview.append( $('<p>プレビューできない形式です</p>') );
											break;
									}
									$body.append($preview);
									var $table = $('<table>');
									$table
										.append( $('<tr>')
											.append( $('<th>').text('Filename') )
											.append( $('<td>').text(item.name) )
										)
										.append( $('<tr>')
											.append( $('<th>').text('Extension') )
											.append( $('<td>').text(item.ext) )
										)
										.append( $('<tr>')
											.append( $('<th>').text('mime-type') )
											.append( $('<td>').text(item.mime) )
										)
										.append( $('<tr>')
											.append( $('<th>').text('File Size') )
											.append( $('<td>').text(item.size + ' byte(s)') )
										)
										.append( $('<tr>')
											.append( $('<th>').text('MD5') )
											.append( $('<td>').text(item.md5) )
										)
									;
									$body.append($table);
								}
							);
						});
					}

					if( !result.list[idx].writable ){
						$a.classList.add('remote-finder__ico-readonly');
					}

					// copy
					$menu = document.createElement('button');
					$menu.textContent = 'copy';
					$menu.classList.add('remote-finder__ico-copy');
					$menu.setAttribute('data-filename', result.list[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
						_this.copy(path+filename, function(){
							_this.setCurrentDir( path );
						});
					});
					$submenuLi = document.createElement('li');
					$submenuLi.append($menu);
					$submenu.append($submenuLi);

					// rename
					$menu = document.createElement('button');
					$menu.textContent = 'rename';
					$menu.classList.add('remote-finder__ico-rename');
					$menu.setAttribute('data-filename', result.list[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
						_this.rename(path+filename, function(){
							_this.setCurrentDir( path );
						});
					});
					$submenuLi = document.createElement('li');
					$submenuLi.append($menu);
					$submenu.append($submenuLi);

					// delete
					$menu = document.createElement('button');
					$menu.textContent = 'delete';
					$menu.classList.add('remote-finder__ico-delete');
					$menu.setAttribute('data-filename', result.list[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
						_this.remove(path+filename, function(){
							_this.setCurrentDir( path );
						});
					});
					$submenuLi = document.createElement('li');
					$submenuLi.append($menu);
					$submenu.append($submenuLi);

					$a.append($submenu);
					$li.append($a);
					$fileList.append($li);
				}
				$elm.append($fileList);
			}
		);
		return;
	}

	/**
	 * Finderを初期化します。
	 */
	this.init = function( path, options, callback ){
		current_dir = path;
		callback = callback || function(){};


		// --------------------------------------
		// MENU
		var $ulMenu = document.createElement('ul');
		$ulMenu.classList.add('remote-finder__menu');

		// create new folder
		var $li = document.createElement('li');
		var $a = document.createElement('a');
		$a.textContent = 'New Folder';
		$a.classList.add('remote-finder__ico-new-folder');
		$a.href = 'javascript:;';
		$a.addEventListener('click', function(){
			_this.mkdir(current_dir, function(){
				_this.setCurrentDir( current_dir );
			});
		});
		$li.append($a);
		$ulMenu.append($li);

		// create new file
		var $li = document.createElement('li');
		var $a = document.createElement('a');
		$a.textContent = 'New File';
		$a.classList.add('remote-finder__ico-new-file');
		$a.href = 'javascript:;';
		$a.addEventListener('click', function(){
			_this.mkfile(current_dir, function(){
				_this.setCurrentDir( current_dir );
			});
		});
		$li.append($a);
		$ulMenu.append($li);

		// file name filter
		var $li = document.createElement('li');
		var $input = document.createElement('input');
		$input.placeholder = 'Filter...';
		$input.type = 'text';
		$input.value = filter;
		$input.addEventListener('change', function(){
			filter = this.value;
			_this.setCurrentDir( current_dir );
		});
		$li.append($input);
		$ulMenu.append($li);

		$elm.append($ulMenu);

		// --------------------------------------
		// Path Bar
		$pathBar = document.createElement('ul');
		$pathBar.classList.add('remote-finder__path-bar');

		$elm.append($pathBar);

		// --------------------------------------
		// File list
		$fileList = document.createElement('ul');
		$fileList.classList.add('remote-finder__file-list');

		$elm.append($fileList);

		this.setCurrentDir(path, callback);
	}
}
