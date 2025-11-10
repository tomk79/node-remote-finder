/**
 * Editor
 */
module.exports = function($elm, remoteFinder){
	const $ = remoteFinder.jQuery;
	let _this = this;
	let currentPath = null;
	let originalContent = null;
	let $modal = null;
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

		// モーダルを生成
		const modalHtml = templates.editor({
			filename: filename
		});
		$modal = $(modalHtml);
		$elm.append($modal);

		// テキストエリアに内容をセット
		$textarea = $modal.find('.remote-finder__editor-modal__textarea');
		$textarea.val(content);
		isModified = false;

		// イベントリスナーを設定
		_this.attachEventListeners();

		// モーダルを表示
		setTimeout(function(){
			$modal.addClass('remote-finder__editor-modal--visible');
		}, 10);
	};

	/**
	 * イベントリスナーを設定
	 */
	this.attachEventListeners = function(){
		// テキストエリアの変更を監視
		$textarea.on('input', function(){
			isModified = ($textarea.val() !== originalContent);
		});

		// 保存ボタン
		$modal.find('.remote-finder__editor-modal__save-button').on('click', function(){
			_this.save();
		});

		// 保存せずに閉じるボタン
		$modal.find('.remote-finder__editor-modal__cancel-button').on('click', function(){
			_this.close(false);
		});

		// 閉じるボタン（×）
		$modal.find('.remote-finder__editor-modal__close-button').on('click', function(){
			if( isModified ){
				if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
					return;
				}
			}
			_this.close(false);
		});

		// オーバーレイクリックで閉じる
		$modal.find('.remote-finder__editor-modal__overlay').on('click', function(){
			if( isModified ){
				if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
					return;
				}
			}
			_this.close(false);
		});

		// ESCキーで閉じる
		$(document).on('keydown.remoteFinder-editor', function(e){
			if( e.key === 'Escape' ){
				if( isModified ){
					if( !confirm('変更が保存されていません。保存せずに閉じますか？') ){
						return;
					}
				}
				_this.close(false);
			}
		});
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
				_this.close(true);
			}
		);
	};

	/**
	 * エディタを閉じる
	 */
	this.close = function(saved){
		// イベントリスナーを解除
		$(document).off('keydown.remoteFinder-editor');

		// モーダルを非表示にしてから削除
		$modal.removeClass('remote-finder__editor-modal--visible');
		setTimeout(function(){
			$modal.remove();
			$modal = null;
			$textarea = null;
			currentPath = null;
			originalContent = null;
			isModified = false;
		}, 300);
	};

	return this;
};
