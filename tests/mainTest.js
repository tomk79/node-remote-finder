var assert = require('assert');
var utils79 = require('utils79');
var RemoteFinder = require('../node/main.js');

describe('Initialize Instance', function() {

	it("Initialize Instance", function(done) {
		this.timeout(60*1000);
        var remoteFinder = new RemoteFinder({});

		assert.equal(typeof(remoteFinder), typeof({}));

		done();
	});

});
