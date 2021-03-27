module.exports = function($elm, main){
	const $ = main.jQuery;
	let templates = {
		'dropzone': require('./templates/dropzone.twig'),
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

			var event = e.originalEvent;
			var fileInfo = event.dataTransfer.files[0];
			console.log( event.dataTransfer.files );

			return;
		});
		return;
	};

}
