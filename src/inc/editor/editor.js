/**
 * Editor
 */
module.exports = function($elm, remoteFinder){
	const $ = remoteFinder.jQuery;
	let _this = this;
	let currentPath = null;
	let originalContent = null;
	let modalObj = null;
	let $textarea = null;
	let isModified = false;

	const templates = {
		'editor': require('./templates/editor.twig'),
	};

	/**
	 * エディタを開く
	 */
	this.open = function(path, callback){
		callback = callback || function(){};
		currentPath = path;

		// ファイル内容を取得
		remoteFinder.gpiBridge(
			{
				api: 'getFileContent',
				path: path,
			},
			function(result){
				if( !result.result ){
					alert('Failed to load file: ' + result.message);
					callback(false);
					return;
				}

				// Base64デコードしてコンテンツを取得
				let content = '';
				if( result.content && result.content.base64 ){
					try {
						content = atob(result.content.base64);
					} catch(e) {
						alert('Failed to decode file content: ' + e.message);
						callback(false);
						return;
					}
				}

				originalContent = content;
				_this.render(path, content);
				callback(true);
			}
		);
	};

	/**
	 * エディタUIをレンダリング
	 */
	this.render = function(path, content){
		const filename = path.split('/').pop();

		// モーダルのボディコンテンツを生成
		const $modalBodyHtml = $(templates.editor({
			filename: filename
		}));

		// 保存ボタン
		const $saveButton = $('<button class="px2-btn px2-btn--primary">').text('保存');
		$saveButton.on('click', function(){
			_this.save();
		});

		// px2style.modal()でモーダルを開く
		modalObj = remoteFinder.px2style.modal({
			"title": filename,
			"type": "modal",
			"body": $modalBodyHtml,
			"width": 800,
			"height": 600,
			"contentFill": true,
			"buttons": [$saveButton],
			"target": $elm[0],
			"onclose": function(){
				_this.cleanup();
			},
		}, function(modal){
			// モーダルが開いた後の処理
			$textarea = $($modalBodyHtml).find('.remote-finder__editor-modal__textarea');
			
			// テキストエリアが見つからない場合は、モーダル全体から検索
			if( $textarea.length === 0 ){
				$textarea = $('.remote-finder__editor-modal__textarea');
			}
			
			// コンテンツをセット
			if( $textarea.length > 0 ){
				$textarea.val(content);
				isModified = false;

				// テキストエリアの変更を監視
				$textarea.on('input', function(){
					isModified = ($textarea.val() !== originalContent);
				});
			} else {
				console.error('Textarea element not found in editor modal');
			}
		});
	};

	/**
	 * クリーンアップ処理
	 */
	this.cleanup = function(){
		// イベントリスナーを解除
		$(document).off('keydown.remoteFinder-editor');

		// 変数をクリア
		modalObj = null;
		$textarea = null;
		currentPath = null;
		originalContent = null;
		isModified = false;
	};

	/**
	 * ファイルを保存
	 */
	this.save = function(){
		const content = $textarea.val();

		remoteFinder.gpiBridge(
			{
				api: 'saveFile',
				path: currentPath,
				options: {
					body: content
				}
			},
			function(result){
				if( !result.result ){
					alert('Failed to save file: ' + result.message);
					return;
				}

				originalContent = content;
				isModified = false;
				alert('ファイルを保存しました。');
				if( modalObj ){
					modalObj.close();
				}
			}
		);
	};

	return this;
};
