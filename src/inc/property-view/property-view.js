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

				drawDirectoryProperties( selectedItems[0], $propertyView.find('.remote-finder__property-view-main') );

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
				'options': {}
			},
			function(result){
				var item = result.itemInfo;
				// console.log(result);
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
	} // drawFileProperties()


	/**
	 * ディレクトリのプロパティ情報を描画する
	 */
	function drawDirectoryProperties( itemName, $body ){
		main.gpiBridge(
			{
				'api': 'getItemInfo',
				'path': main.getCurrentDir() + itemName,
				'options': {}
			},
			function(result){
				var item = result.itemInfo;
				// console.log(result);

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
	} // drawDirectoryProperties()


	/**
	 * プレビューを描画する
	 */
	function drawPreview($previewElm, preview){
		if( !preview || !preview.mime ){
			$previewElm.append( $('<div class="remote-finder__preview-disabled">プレビューできない形式か、ファイルサイズが大きすぎるため、プレビューを中止しました。</div>') );
			return;
		}

		switch(preview.ext){
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
				$previewElm.append( $('<pre>').append( $('<code>').text( decodeURIComponent(escape(atob(preview.base64))) ) ) );
				break;
			case 'jpg': case 'jpeg': case 'jpe':
			case 'png': case 'gif':
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

		main.px2style.loading();

		main.gpiBridge(
			{
				'api': 'getFileContent',
				'path': main.getCurrentDir() + itemName,
				'options': {}
			},
			function(result){
				// console.log('content:', result);
				if( !result.result ){
					console.error('Failed to get file content:', result);
					main.px2style.closeLoading();
					alert('ファイルの取得に失敗しました。');
					return;
				}
				var item = result.content;
				a.href = 'data:'+item.mime+';base64,'+item.base64;
				a.click();

				main.px2style.closeLoading();
				return;
			}
		);

		return false;
	}

}
