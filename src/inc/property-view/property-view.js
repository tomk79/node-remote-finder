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
			}else{
				// ファイル
				$propertyView.html( templates.file({
					'currentDir': main.getCurrentDir(),
					'itemName': selectedItems[0],
				}) );
			}

			// コピー
			$propertyView.find('.remote-finder__property-view-btn-copy').on('click', function(e){
				e.stopPropagation();
				var path = this.getAttribute('data-current-dir');
				var filename = this.getAttribute('data-filename');
				main.copy(path+filename, function(){
					main.setCurrentDir( path );
				});
			});

			// 改名
			$propertyView.find('.remote-finder__property-view-btn-rename').on('click', function(e){
				e.stopPropagation();
				var path = this.getAttribute('data-current-dir');
				var filename = this.getAttribute('data-filename');
				main.rename(path+filename, function(){
					main.setCurrentDir( path );
				});
			});

			// 削除
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
