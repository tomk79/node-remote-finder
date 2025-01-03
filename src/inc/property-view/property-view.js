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

				drawDirectoryProperties( selectedItems[0], $propertyView.find('.remote-finder__property-view-main') );

				// 開く
				$propertyView.find('.remote-finder__property-view-btn-open').on('click', function(e){
					e.stopPropagation();
					var path = this.getAttribute('data-current-dir');
					var filename = this.getAttribute('data-filename');
					var goto = path + filename;
					if( filename == '../' ){
						goto = path.replace(/[^\/]*\/$/, '');
					}
					main.setCurrentDir( goto );
				});

			}else{
				// ファイル
				$propertyView.html( templates.file({
					'currentDir': main.getCurrentDir(),
					'itemName': selectedItems[0],
				}) );

				drawFileProperties( selectedItems[0], $propertyView.find('.remote-finder__property-view-main') );

				// 開く
				$propertyView.find('.remote-finder__property-view-btn-open').on('click', function(e){
					e.stopPropagation();
					var path = this.getAttribute('data-current-dir');
					var filename = this.getAttribute('data-filename');
					main.open( path+filename, function(res){} );
				});

				// ダウンロード
				$propertyView.find('.remote-finder__property-view-btn-download').on('click', function(e){
					e.stopPropagation();
					var path = this.getAttribute('data-current-dir');
					var filename = this.getAttribute('data-filename');
					return downloadFile( this, filename );
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

	/**
	 * ファイルのプロパティ情報を描画する
	 */
	function drawFileProperties( itemName, $body ){
		main.gpiBridge(
			{
				'api': 'getItemInfo',
				'path': main.getCurrentDir() + itemName,
				'options': {},
			},
			function(result){
				var item = result.itemInfo;

				var $preview = $('<div class="remote-finder__preview">');
				drawPreview($preview, item.preview);
				$body.append($preview);

				var $table = $('<table>');
				$table
					.append( $('<tr>')
						.append( $('<th>').text('File Name') )
						.append( $('<td>').text(item.name) )
					)
					.append( $('<tr>')
						.append( $('<th>').text('Extension') )
						.append( $('<td>').text(item.ext || '') )
					)
					.append( $('<tr>')
						.append( $('<th>').text('mime-type') )
						.append( $('<td>').text(item.mime || '') )
					)
					.append( $('<tr>')
						.append( $('<th>').text('File Size') )
						.append( $('<td>').text(item.size + ' byte(s)') )
					)
					.append( $('<tr>')
						.append( $('<th>').text('MD5') )
						.append( $('<td>').text(item.md5 || '') )
					)
				;
				if( item.uname && item.gname ){
					$table
						.append( $('<tr>')
							.append( $('<th>').text('Owner') )
							.append( $('<td>').text( ( item.uname || '---' ) + ' ' + ( item.gname || '---' ) ) )
						)
					;
				}
				if( item.mode ){
					$table
						.append( $('<tr>')
							.append( $('<th>').text('Mode') )
							.append( $('<td>').text(item.mode || '') )
						)
					;
				}
				$body.append($table);
			}
		);
	}


	/**
	 * ディレクトリのプロパティ情報を描画する
	 */
	function drawDirectoryProperties( itemName, $body ){
		main.gpiBridge(
			{
				'api': 'getItemInfo',
				'path': main.getCurrentDir() + itemName,
				'options': {},
			},
			function(result){
				var item = result.itemInfo;

				var $table = $('<table>');
				$table
					.append( $('<tr>')
						.append( $('<th>').text('Directory Name') )
						.append( $('<td>').text(item.name) )
					)
				;
				if( item.uname && item.gname ){
					$table
						.append( $('<tr>')
							.append( $('<th>').text('Owner') )
							.append( $('<td>').text( ( item.uname || '---' ) + ' ' + ( item.gname || '---' ) ) )
						)
					;
				}
				if( item.mode ){
					$table
						.append( $('<tr>')
							.append( $('<th>').text('Mode') )
							.append( $('<td>').text(item.mode || '') )
						)
					;
				}
				$body.append($table);
			}
		);
	}


	/**
	 * プレビューを描画する
	 */
	function drawPreview($previewElm, preview){
		if( !preview || !preview.mime ){
			$previewElm.append( $('<div class="remote-finder__preview-disabled">プレビューできない形式か、ファイルサイズが大きすぎるため、プレビューを中止しました。</div>') );
			return;
		}

		switch(preview.ext){
			case 'html': case 'htm':
			case 'xhtml': case 'xhtm':
			case 'md':
			case 'csv':
			case 'txt':
			case 'css': case 'scss':
			case 'js':
			case 'jsx':
			case 'ts':
			case 'twig':
			case 'ini':
			case 'yml':
			case 'xml':
			case 'rss': case 'rdf':
			case 'mm':
			case 'svg':
			case 'json':
			case 'env':
			case 'htaccess':
			case 'gitkeep': case 'gitignore': case 'gitattributes':
			case 'jsp':
			case 'php': case 'inc':
			case 'cgi':
			case 'rb':
			case 'pl':
				$previewElm.append( $('<pre>').append( $('<code>').text( decodeURIComponent(escape(atob(preview.base64))) ) ) );
				break;
			case 'png':
			case 'jpg': case 'jpeg': case 'jpe':
			case 'webp':
			case 'gif':
				$previewElm.append( $('<img>').attr({
					'src': 'data:'+preview.mime+';base64,'+preview.base64
				}) );
				break;
			default:
				$previewElm.append( $('<div class="remote-finder__preview-disabled">プレビューできない形式か、ファイルサイズが大きすぎるため、プレビューを中止しました。</div>') );
				break;
		}
		return;
	}


	/**
	 * ファイルをダウンロードする
	 */
	function downloadFile( a, itemName ){
		if( a.href && a.href != 'about:blank' ){
			return true;
		}

		new Promise((resolve) => {
			main.px2style.loading();
			resolve();
		}).then(() => {
			return new Promise((resolve, reject) => {
				const generateDownloadLink = main.getOptions().generateDownloadLink;
				if( generateDownloadLink ){
					generateDownloadLink(main.getCurrentDir() + itemName, function(downloadLink){
						resolve(downloadLink);
					});
					return;
				}else{
					main.gpiBridge(
						{
							'api': 'getFileContent',
							'path': main.getCurrentDir() + itemName,
							'options': {},
						},
						function(result){
							if( !result.result ){
								reject(result.message);
								return;
							}
							var item = result.content;
							const downloadLink = 'data:'+item.mime+';base64,'+item.base64;
							resolve(downloadLink);
							return;
						},
						function(err){
							reject(err);
							return;
						}
					);
				}

			});
		}).then((downloadLink) => {
			return new Promise((resolve, reject) => {
				a.href = downloadLink;
				a.click();

				main.px2style.closeLoading();
				resolve();
			});
		}).catch((err) => {
			console.error('Failed to get file content:', err);
			main.px2style.closeLoading();
			alert('ファイルのダウンロードに失敗しました。ファイルサイズが大きすぎる可能性があります。');
		});

		return false;
	}

}
