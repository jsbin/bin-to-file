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
});