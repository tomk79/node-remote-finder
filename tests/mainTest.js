var assert = require('assert');
var utils79 = require('utils79');
var fsX = require('fs-extra');
var RemoteFinder = require('../node/main.js');
var remoteFinder = new RemoteFinder({
	"default": require('path').resolve(__dirname, 'data/root1/')
});

describe('Initialize Instance', function() {

	it("Initialize Instance", function(done) {
		this.timeout(60*1000);

		assert.equal(typeof(remoteFinder), typeof({}));
		done();
	});

	it("Getting List", function(done) {
		this.timeout(60*1000);

		remoteFinder.gpi({
			'path': '/',
			'api': 'getItemList'
		}, function(result){
			// console.log(result);

			assert.equal(result.length, 2);
			assert.equal(result[0].name, 'subdir1');

			done();
		});

	});

	it("Creating Folder And Files", function(done) {
		this.timeout(60*1000);

		remoteFinder.gpi({
			'path': '/create_test/',
			'api': 'createNewFolder'
		}, function(result){
			// console.log(result);
			assert.ok(result.result);
			assert.equal(result.message, 'OK');

			remoteFinder.gpi({
				'path': '/create_test/create_test.txt',
				'api': 'createNewFile'
			}, function(result){
				// console.log(result);

				assert.ok(result.result);
				assert.equal(result.message, 'OK');
				assert.ok(utils79.is_file(__dirname+'/data/root1/create_test/create_test.txt'));

				fsX.removeSync(__dirname+'/data/root1/create_test/');

				done();
			});
		});

	});

});
