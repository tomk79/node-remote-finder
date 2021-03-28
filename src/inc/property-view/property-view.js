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
