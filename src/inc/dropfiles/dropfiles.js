module.exports = function($elm, main){
	const $ = main.jQuery;
	const it79 = require('iterate79');
	let templates = {
		'uploadDialog': require('./templates/upload-dialog.twig'),
		'dropzone': require('./templates/dropzone.twig'),
		'resultOk': require('./templates/result-ok.twig'),
		'resultNg': require('./templates/result-ng.twig'),
	};

	this.onDragEnter = function(e){
		e.preventDefault();
		e.stopPropagation();

		// console.log('*** DragEnter');

		let $html = $(templates.dropzone({}));
		$elm.append($html);
		$html.on('dragenter', function(e){
			e.preventDefault();
			e.stopPropagation();
			// console.log('----- DragEnter');
			return;
		});
		$html.on('dragover', function(e){
			e.preventDefault();
			e.stopPropagation();
			// console.log('DragOver');
			return;
		});
		$html.on('dragleave', function(e){
			e.preventDefault();
			e.stopPropagation();
			// console.log('DragLeave');
			$('.remote-finder__dropzone').remove();
			return;
		});
		$html.on('drop', function(e){
			e.preventDefault();
			e.stopPropagation();
			// console.log('Dropped');
			$('.remote-finder__dropzone').remove();

			var modalObj;
			var event = e.originalEvent;
			var files = event.dataTransfer.files;
			if( !files.length ){
				return;
			}

			// console.log( files );

			let $body = $(templates.uploadDialog({
				'files': files,
			}));
			let $btnUpload = $('<button>');
			let $btnCancel = $('<button>');

			main.px2style.modal({
				'title': 'ファイルをアップロード',
				'body': $body,
				'buttons': [
					$btnUpload
						.text('アップロードする')
						.addClass('px2-btn')
						.addClass('px2-btn--primary')
						.on('click', function(){
							let $formElms = $('input, button');
							$formElms.attr('disabled', true);
							modalObj.closable(false);

							let allow_overwrite = $body.find('input[name=allow_overwrite]:checked').val();

							uploadFiles(files, allow_overwrite, $body, function(){
								modalObj.closable(true);
								$btnUpload.text('再アップロード');
								$btnCancel.text('閉じる');
								$formElms.removeAttr('disabled');
								// main.px2style.closeModal();
								main.refresh();
							});
						})
				],
				'buttonsSecondary': [
					$btnCancel
						.text('キャンセル')
						.on('click', function(){
							main.px2style.closeModal();
						})
				]
			}, function( _modalObj ){
				modalObj = _modalObj;
			});

			return;
		});
		return;
	};

	/**
	 * ファイルをアップロードする
	 */
	function uploadFiles(files, allow_overwrite, $body, callback){
		// console.log(files);
		callback = callback || function(){};

		$body.find('.remote-finder__upload-dialog-result').text('');

		function readSelectedLocalFile(fileInfo, callback){
			try {
				if( typeof(fileInfo) !== typeof({}) ){
					// オブジェクト以外
					// console.error('fileInfo is not an Object:', fileInfo);
					callback(false);
				}else if( !fileInfo.size && fileInfo.type === "" ){
					// ディレクトリ
					callback(false);
				}else{
					// ファイル
					var reader = new FileReader();
					reader.onload = function(evt) {
						// console.log(evt);
						callback( evt );
					}
					reader.readAsDataURL(fileInfo);
				}
			}catch(e){
				console.error(e);
				callback(false);
			}
		}

		it79.ary(
			files,
			function(itAry1, row, idx){
				var $reportTd = $body.find('[data-filename="'+(row.name)+'"] .remote-finder__upload-dialog-result');

				readSelectedLocalFile(row, function(loadedFileInfo){
					// console.log('=-=-=-= loadedFileInfo:', loadedFileInfo);

					if( loadedFileInfo === false ){
						// 読み込みに失敗
						// console.log('Failed to load file:', idx, row);
						$reportTd.html( templates.resultNg({}) );
						setTimeout(function(){
							itAry1.next();
						}, 200);
						return;
					}
					var base64 = loadedFileInfo.target.result.replace(new RegExp('^data\\:[^\\;]*\\;base64\\,'), '');

					main.gpiBridge(
						{
							'api': 'saveFile',
							'path': main.getCurrentDir()+row.name,
							'options': {
								'allow_overwrite': allow_overwrite,
								'base64': base64,
							},
						},
						function(result){
							if(!result.result){
								console.error(result.message);
							}
							$reportTd.html( (result.result ? templates.resultOk({}) : templates.resultNg({})) );
							setTimeout(function(){
								itAry1.next();
							}, 200);
						}
					);
				});
				return;
			},
			function(){
				callback();
			}
		);

	}

}
