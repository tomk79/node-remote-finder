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

				originalContent = result.body;
				_this.render(path, result.body);
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
		const modalBodyHtml = templates.editor({
			filename: filename
		});

		// 保存ボタン
		const $saveButton = $('<button class="px2-btn px2-btn--primary">').text('保存');
		$saveButton.on('click', function(){
			_this.save();
		});

		// キャンセルボタン
		const $cancelButton = $('<button class="px2-btn px2-btn--secondary">').text('保存せずに閉じる');
		$cancelButton.on('click', function(){
			if( isModified ){
				if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
					return;
				}
			}
			modalObj.close();
		});

		// px2style.modal()でモーダルを開く
		modalObj = remoteFinder.px2style.modal({
			"title": filename,
			"type": "modal",
			"body": modalBodyHtml,
			"width": 800,
			"height": 600,
			"contentFill": true,
			"buttons": [$saveButton],
			"buttonsSecondary": [$cancelButton],
			"target": $elm[0],
			"onclose": function(){
				_this.cleanup();
			},
			"onbgclick": function(){
				if( isModified ){
					if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
						return false;
					}
				}
			}
		}, function(modal){
			// モーダルが開いた後の処理
			$textarea = $(modal.getBody()).find('.remote-finder__editor-modal__textarea');
			$textarea.val(content);
			isModified = false;

			// テキストエリアの変更を監視
			$textarea.on('input', function(){
				isModified = ($textarea.val() !== originalContent);
			});

			// ESCキーで閉じる
			$(document).on('keydown.remoteFinder-editor', function(e){
				if( e.key === 'Escape' ){
					if( isModified ){
						if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
							return;
						}
					}
					modalObj.close();
				}
			});
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
