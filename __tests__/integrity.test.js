'use strict';
/*global describe, it, beforeEach, after */
var w3cjs = require('w3cjs');
var toFile = require('../lib');
var fs = require('fs');
var path = require('path');

describe('integrity', function() {
  var filename = path.join(
    __dirname,
    'fixtures',
    'tmp-' + ((Math.random() * 1000) | 0) + '.html'
  );
  var html = '';

  beforeEach(function() {
    html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'simple.html'),
      'utf8'
    );
  });

  afterAll(function() {
    fs.unlinkSync(filename);
  });

  it('should create valid document with just HTML, CSS & JS', function(done) {
    var javascript = 'alert("Hello world");';
    var css = 'body { background-color: red; }';
    var meta = '<!-- created during a test -->';
    var file = toFile({
      html: html,
      javascript: javascript,
      css: css,
      meta: meta,
    });

    fs.writeFileSync(filename, file, 'utf8');

    w3cjs.validate({
      file: filename,
      callback: function(res) {
        if (res.messages && res.messages.length > 0) {
          throw { error: 'html errors have been found', results: res };
        }
        done();
      },
    });
  });
});
