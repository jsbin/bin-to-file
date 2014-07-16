'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../');
var fs = require('fs');
var path = require('path');

describe('simple html', function () {
  var html = '';

  beforeEach(function () {
    html = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple.html'), 'utf8');
  });

  it('should have fixtures', function () {
    assert(html.length > 0, 'fixture HTML has content');
  });

  it('do nothing to plain html', function () {
    var file = toFile({ html: html });

    assert(html === file, 'content matches');
  });

  it('should insert meta description below doctype', function () {
    var meta = '<!-- testing -->';
    var file = toFile({ html: html, meta: meta });

    assert(html !== file, 'content does not match');
    assert(file.indexOf(meta) !== -1, 'contains the metadata: ' + file);
    assert(file.split('\n').shift().indexOf('<!DOCTYPE') === 0, 'has doctype as first line: ' + file.split('\n').shift());
  });

  it('should insert JS before the closing body', function () {
    var javascript = 'alert("Hello world");';
    var file = toFile({ html: html, javascript: javascript });

    assert(file.indexOf(javascript) !== -1, 'contains the javascript: ' + file);

    var lines = file.split('\n');
    var pos = lines.indexOf(javascript);
    assert(lines[pos + 2].indexOf('</body>') === 0, lines.join('\n'));
  });
});