(function(){
	var remoteFinder = new RemoteFinder(
		document.getElementById('finder1'),
		{
			"gpiBridge": function(input, callback){
				// Native (HTML5 Fetch API)
				console.log(input);
				fetch("/apis/remote-finder", {
					method: "post",
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(input)
				}).then(function (response) {
					console.log(response);
					var contentType = response.headers.get('content-type').toLowerCase();
					if(contentType.indexOf('application/json') === 0 || contentType.indexOf('text/json') === 0) {
						response.json().then(function(json){
							console.log(json);
							callback(json);
						});
					} else {
						response.text().then(function(text){
							callback(text);
						});
					}
				}).catch(function (response) {
					console.log(response); // => "TypeError: ~"
					callback(response);
				});
			},
			"open": function(fileinfo, callback){
				console.log(fileinfo);
				alert('ファイル ' + fileinfo.path + ' を開きました。');
				callback(true);
			}
		}
	);
	// console.log(remoteFinder);
	remoteFinder.init('/', {}, function(){
		console.log('ready.');
	});
})();
