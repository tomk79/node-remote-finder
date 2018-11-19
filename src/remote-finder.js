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
				$li.append($a);
				$ul.append($li);

				// contained file and folders
				for( var idx in result ){
					var $li = document.createElement('li');
					var $a = document.createElement('a');
					$a.textContent = result[idx].name;
					$a.href = 'javascript:;';
					$a.setAttribute('data-filename', result[idx].name);
					$submenu = document.createElement('ul');
					$submenu.classList.add('remote-finder__file-list-submenu');
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

					$menu = document.createElement('a');
					$menu.textContent = 'delete';
					$menu.href = 'javascript:;';
					$menu.setAttribute('data-filename', result[idx].name);
					$menu.addEventListener('click', function(e){
						e.stopPropagation();
						var filename = this.getAttribute('data-filename');
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
