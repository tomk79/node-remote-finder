/**
 * Remote Finder
 */
module.exports = function(elm, options){
	let _this = this;
	let $ = require('jquery');
	this.jQuery = $;
	var px2style = window.px2style;
	this.px2style = px2style;
	let current_dir = '/';
	let filter = '';
	let $pathBar;
	let $fileList;
	let selectedItems = [];
	let $elm = $(elm);
	const dropzone = new (require('./dropfiles/dropfiles.js'))($elm, this);
	const propertyView = new (require('./property-view/property-view.js'))($elm, this);

	let templates = {
		'main': require('./templates/main.twig'),
	};

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

	$elm.addClass('remote-finder');


	/**
	 * Finderを初期化します。
	 */
	this.init = function( path, options, callback ){
		current_dir = path;
		callback = callback || function(){};

		$elm.html( templates.main({}) );

		// --------------------------------------
		// MENU
		var $ulMenu = $elm.find('ul.remote-finder__menu');

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

		// $elm.append($ulMenu);

		// --------------------------------------
		// Path Bar
		$pathBar = $elm.find('ul.remote-finder__path-bar');

		// $elm.append($pathBar);

		// --------------------------------------
		// File list
		$fileList = $elm.find('ul.remote-finder__file-list');

		// $elm.append($fileList);

		this.setCurrentDir(path, callback);

		$elm
			.on('dragenter', dropzone.onDragEnter)
			.on('dragover', function(e){
				let event = e.originalEvent;
				event.preventDefault();
				event.stopPropagation();
			})
			.on('drop', function(e){
				let event = e.originalEvent;
				event.preventDefault();
				event.stopPropagation();
			})
		;

	}

	/**
	 * サーバーサイドスクリプトに問い合わせる
	 */
	function gpiBridge(input, callback){
		options.gpiBridge(input, callback);
	}
	this.gpiBridge = gpiBridge;

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
			_this.refresh();
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
					'path': current_dir+foldername,
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					_this.refresh();
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
					'path': current_dir+filename,
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					_this.refresh();
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
						'to': copyTo,
					},
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					_this.refresh();
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
						'to': renameTo,
					},
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					_this.refresh();
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
					'path': path_target,
					'options': {},
				},
				function(result){
					if(!result.result){
						alert(result.message);
					}
					_this.refresh();
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
		path = path.replace(/\/+$/, '/');

		current_dir = path;
		callback = callback || function(){};

		this.clearSelectedItems();

		gpiBridge(
			{
				'api': 'getItemList',
				'path': path,
				'options': {},
			},
			function(result){
				if( !result.result ){
					alert( result.message );
					return;
				}

				// --------------------------------------
				// Path Bar
				$pathBar.html('');
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

				// $elm.append($pathBar);

				// --------------------------------------
				// File list
				$fileList.html('');

				// parent directory
				if(path != '/' && path){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = '../';
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', '../');
					$a.setAttribute('data-path', path);
					$a.addEventListener('click', function(){
						_this.clearSelectedItems();
						var filename = this.getAttribute('data-filename');
						_this.addSelectedItem(filename);
					});
					$a.addEventListener('dblclick', function(){
						var tmp_path = this.getAttribute('data-path');
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
					if(result.list[idx].type == 'dir'){
						// ディレクトリ
						$a.textContent += '/';
						$a.setAttribute('data-filename', $a.getAttribute('data-filename')+'/');
						$a.classList.add('remote-finder__ico-folder');
						$a.addEventListener('click', function(){
							_this.clearSelectedItems();
							var filename = this.getAttribute('data-filename');
							_this.addSelectedItem(filename);
						});
						$a.addEventListener('dblclick', function(e){
							var filename = this.getAttribute('data-filename');
							_this.setCurrentDir( path+filename+'/' );
						});

					}else if(result.list[idx].type == 'file'){
						// ファイル
						$a.classList.add('remote-finder__ico-file');
						$a.addEventListener('click', function(){
							_this.clearSelectedItems();
							var filename = this.getAttribute('data-filename');
							_this.addSelectedItem(filename);
						});
						$a.addEventListener('dblclick', function(e){
							var path = this.getAttribute('data-path');
							var filename = this.getAttribute('data-filename');
							_this.open( path, function(res){} );
						});
					}

					if( !result.list[idx].writable ){
						$a.classList.add('remote-finder__ico-readonly');
					}

					$li.append($a);
					$fileList.append($li);
				}

				setTimeout(function(){
					callback();
				},10);
			}
		);
		return;
	}

	/**
	 * 選択ファイルを追加する
	 */
	this.addSelectedItem = function(itemName){
		selectedItems.push(itemName);
		propertyView.update(selectedItems);
		let $a = $elm.find('.remote-finder__file-list [data-filename="'+itemName+'"]');
		$a.addClass('remote-finder__selected');
		return;
	}

	/**
	 * 選択状態を解除する
	 */
	this.deleteSelectedItem = function(itemName){
		for( let i = 0; selectedItems.length > i; i ++ ){
			if( selectedItems[i] == itemName ){
				selectedItems[i] = undefined;
				delete(selectedItems[i]);
				break;
			}
		}
		propertyView.update(selectedItems);
		let $a = $elm.find('.remote-finder__file-list [data-filename="'+itemName+'"]');
		$a.removeClass('remote-finder__selected');
		return;
	}

	/**
	 * 全てのファイルの選択状態を解除する
	 */
	this.clearSelectedItems = function(){
		selectedItems = [];
		propertyView.update(selectedItems);
		$elm.find('.remote-finder__selected').removeClass('remote-finder__selected');
		return;
	}


	/**
	 * リスト表示を更新する
	 */
	this.refresh = function(){
		var currentDir = this.getCurrentDir();
		var $list = $('.remote-finder__file-list');
		var memoScrollTop = $list.scrollTop();
		_this.setCurrentDir(currentDir, function(){
			setTimeout(function(){
				$('.remote-finder__file-list').scrollTop(memoScrollTop);
			},20);
		});
	}

	/**
	 * テンプレートにデータを適用して返す
	 */
	this.bindTemplate = function(templateName, data){
		return templates[templateName](data);
	}

}
