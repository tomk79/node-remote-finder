module.exports = function($elm, main){
	const $ = main.jQuery;
	const it79 = require('iterate79');
	let templates = {
		'dir': require('./templates/dir.twig'),
		'file': require('./templates/file.twig'),
	};


	/**
	 * プロパティビューを更新する
	 */
	this.update = function( selectedItems ){
		console.log('selectedItems:', selectedItems);
		let $propertyView = $elm.find('.remote-finder__property-view-inner');
		if( !selectedItems.length ){
			$propertyView.html('');
			return;
		}

		if( selectedItems.length == 1 ){
			if( selectedItems[0].match(/\/$/) ){
				// ディレクトリ
				$propertyView.html( templates.dir({
					'currentDir': main.getCurrentDir(),
					'itemName': selectedItems[0],
				}) );

				// 開く
				$propertyView.find('.remote-finder__property-view-btn-open').on('click', function(e){
					e.stopPropagation();
					var path = this.getAttribute('data-current-dir');
					var filename = this.getAttribute('data-filename');
					main.setCurrentDir( path+filename+'/' );
				});

			}else{
				// ファイル
				$propertyView.html( templates.file({
					'currentDir': main.getCurrentDir(),
					'itemName': selectedItems[0],
				}) );

				main.gpiBridge(
					{
						'api': 'getItemInfo',
						'path': main.getCurrentDir()+selectedItems[0],
						'options': {}
					},
					function(result){
						var $body = $propertyView.find('.remote-finder__property-view-main');
						var item = result.itemInfo;
						console.log(result);
						var $preview = $('<div class="remote-finder__preview">');
						switch(item.ext){
							case 'html': case 'htm': case 'xhtml': case 'xml':
							case 'php': case 'inc':
							case 'rb':
							case 'jsp':
							case 'js': case 'json':
							case 'css': case 'scss':
							case 'md':
							case 'mm':
							case 'txt':
							case 'svg':
							case 'htaccess':
							case 'gitkeep': case 'gitignore':
								$preview.append( $('<pre>').append( $('<code>').text( decodeURIComponent(escape(atob(item.base64))) ) ) );
								break;
							case 'jpg': case 'jpeg': case 'jpe':
							case 'png': case 'gif':
								$preview.append( $('<img>').attr({
									'src': 'data:'+item.mime+';base64,'+item.base64
								}) );
								break;
							default:
								$preview.append( $('<div class="remote-finder__preview-disabled">プレビューできない形式です</div>') );
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

				// 開く
				$propertyView.find('.remote-finder__property-view-btn-open').on('click', function(e){
					e.stopPropagation();
					var path = this.getAttribute('data-current-dir');
					var filename = this.getAttribute('data-filename');
					main.open( path+filename, function(res){} );
				});

			}

			// Dir/File共通: コピー
			$propertyView.find('.remote-finder__property-view-btn-copy').on('click', function(e){
				e.stopPropagation();
				var path = this.getAttribute('data-current-dir');
				var filename = this.getAttribute('data-filename');
				main.copy(path+filename, function(){
					main.setCurrentDir( path );
				});
			});

			// Dir/File共通: 改名
			$propertyView.find('.remote-finder__property-view-btn-rename').on('click', function(e){
				e.stopPropagation();
				var path = this.getAttribute('data-current-dir');
				var filename = this.getAttribute('data-filename');
				main.rename(path+filename, function(){
					main.setCurrentDir( path );
				});
			});

			// Dir/File共通: 削除
			$propertyView.find('.remote-finder__property-view-btn-delete').on('click', function(e){
				e.stopPropagation();
				var path = this.getAttribute('data-current-dir');
				var filename = this.getAttribute('data-filename');
				main.remove(path+filename, function(){
					main.setCurrentDir( path );
				});
			});

		}else{
			// 複数選択
			$propertyView.html( templates.multi({
				'currentDir': main.getCurrentDir(),
				'items': selectedItems,
			}) );
		}

		return;
	}

}
