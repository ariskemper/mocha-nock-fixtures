var fs             = require('fs');
var assert         = require('assert');
var request        = require('request');
var path           = require('path');
var app            = require('./app');
var mkdirp         = require('mkdirp');
var describeFixture = require('../lib/describe-fixture');

var called;
describeFixture('Playback', function() {
  before(function(done) {
    var fileContents = fs.readFileSync(
      path.join(__dirname, 'test-fixtures', 'saved-fixture.js'),
      { encoding: 'utf8' }
    );
    var fixturePath = path.join(__dirname, 'fixtures/Playback/uses saved fixture instead of server.js');
    mkdirp.sync(path.dirname(fixturePath));
    fs.writeFileSync(fixturePath, fileContents);

    app.get('/shouldnt-be-called', function(req, res) {
      called++;
      res.send('ok');
    });

    app.listen(4001, done);
  });

  beforeEach(function() {
    called = 0;
  });

  it('uses saved fixture instead of server', function(done) {
    request('http://localhost:4001/shouldnt-be-called', function() {
      assert.equal(called, 0, 'should not have been called');
      done();
    });
  });
});
