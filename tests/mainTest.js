var assert = require('assert');
var utils79 = require('utils79');
var fsX = require('fs-extra');
var RemoteFinder = require('../node/main.js');
var remoteFinder = new RemoteFinder({
	"default": require('path').resolve(__dirname, 'data/root1/')
},{
	'paths_invisible': [
		'/invisibles/*',
		'*.hide'
	],
	'paths_readonly': [
		'/readonly/*'
	]
});

describe('Initialize Instance', function() {

	it("Initialize Instance", function(done) {
		this.timeout(60*1000);

		assert.equal(typeof(remoteFinder), typeof({}));
		done();
	});

	it("Resolve Path", function(done) {
		this.timeout(60*1000);

		assert.equal(remoteFinder.getResolvedPath('\\test\\test\\test.txt'), '/test/test/test.txt');
		assert.equal(remoteFinder.getResolvedPath('C:\\test\\test\\test.txt'), '/test/test/test.txt');
		assert.equal(remoteFinder.getResolvedPath('C:\\test\\..\\test.txt'), '/test.txt');
		assert.equal(remoteFinder.getResolvedPath('test.txt'), '/test.txt');

		done();
	});

	it("Invisibles", function(done) {
		this.timeout(60*1000);

		assert.strictEqual(true, remoteFinder.isVisiblePath('/visible/test.txt'));
		assert.strictEqual(false, remoteFinder.isVisiblePath('/invisibles/test.txt'));
		assert.strictEqual(false, remoteFinder.isVisiblePath('/visible/test.hide'));

		done();
	});

	it("Read only", function(done) {
		this.timeout(60*1000);

		assert.strictEqual(true, remoteFinder.isWritablePath('/visible/test.txt'));
		assert.strictEqual(true, remoteFinder.isWritablePath('/writable/test.txt'));
		assert.strictEqual(false, remoteFinder.isWritablePath('/invisibles/test.txt')); // Invisible なパスは 自動的に ReadOnly になる
		assert.strictEqual(false, remoteFinder.isWritablePath('/visible/test.hide')); // Invisible なパスは 自動的に ReadOnly になる
		assert.strictEqual(false, remoteFinder.isWritablePath('/readonly/test.txt'));

		done();
	});

	it("Getting List", function(done) {
		this.timeout(60*1000);

		remoteFinder.gpi({
			'path': '/',
			'api': 'getItemList'
		}, function(result){
			assert.ok(result.result);
			assert.equal(result.message, 'OK');
			assert.equal(result.list.length, 5);
			assert.equal(result.list[0].name, 'readonly');
			assert.equal(result.list[1].name, 'subdir1');

			done();
		});

	});

	it("Creating Folder And Files", function(done) {
		this.timeout(60*1000);

		remoteFinder.gpi({
			'path': '/create_test/',
			'api': 'createNewFolder'
		}, function(result){
			assert.ok(result.result);
			assert.equal(result.message, 'OK');

			remoteFinder.gpi({
				'path': '/create_test/create_test.txt',
				'api': 'createNewFile'
			}, function(result){
				assert.ok(result.result);
				assert.equal(result.message, 'OK');
				assert.ok(utils79.is_file(__dirname+'/data/root1/create_test/create_test.txt'));

				remoteFinder.gpi({
					'path': '/create_test/create_test_2.txt',
					'api': 'createNewFile'
				}, function(result){
					assert.ok(result.result);
					assert.equal(result.message, 'OK');
					assert.ok(utils79.is_file(__dirname+'/data/root1/create_test/create_test_2.txt'));

					done();
				});
			});
		});

	});

	it("Remove Folder And Files", function(done) {
		this.timeout(60*1000);

		remoteFinder.gpi({
			'path': '/create_test/create_test.txt',
			'api': 'remove'
		}, function(result){
			assert.ok(result.result);
			assert.equal(result.message, 'OK');

			remoteFinder.gpi({
				'path': '/create_test/',
				'api': 'remove'
			}, function(result){
				assert.ok(result.result);
				assert.equal(result.message, 'OK');
				assert.ok(!utils79.is_file(__dirname+'/data/root1/create_test/create_test.txt'));

				done();
			});
		});

	});

});
