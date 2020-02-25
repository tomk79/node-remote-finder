/**
 * modal.js
 */
module.exports = function(main, $elm, template){
	var _this = this;
	var $ = require('jquery')
	var $modal;

	/**
	 * モーダルダイアログを開く
	 */
	this.open = function(opts){
		opts = opts || {};
		opts.title = opts.title || "";
		opts.body = opts.body || {};
		this.close();
		$modal = $(template);
		$($elm).append($modal);

		$modal.find('.remote-finder__modal-title').text(opts.title);
		$modal.find('.remote-finder__modal-body').append(opts.body);
		$btns = $modal.find('.remote-finder__modal-btns');
		if( opts && opts.btns ){
			for(var idx in opts.btns){
				var $btn = $('<button></button>');
				$btns.append( $btn );
				$btn.text(opts.btns[idx].label);
				$btn.attr({'class': opts.btns[idx].class});
				$btn.on('click', opts.btns[idx].click);
			}
		}
	};

	/**
	 * モーダルダイアログを閉じる
	 */
	this.close = function(){
		$($modal).remove();
	};
}
