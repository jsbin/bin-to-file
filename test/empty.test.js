'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../');
var fs = require('fs');
var path = require('path');

describe('empty bin', function () {
  var html = '';

  beforeEach(function () {
    html = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple.html'), 'utf8');
  });

  it('should insert JS at end when missing </body>', function () {
    var file = toFile({ html: html, javascript: '', css: '' });

    file = file.replace(/<!--hash:.*?-->\n/, '');

    assert(file === html, 'output is exactly the same');
  });
});