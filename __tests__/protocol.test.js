'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../lib');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

describe('protocol-less bin', function() {
  var html = '';

  beforeEach(function() {
    html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'protocol.html'),
      'utf8'
    );
  });

  it('should be the same without a protocol', function() {
    var file = toFile({ html: html, javascript: '', css: '' }, { proto: '' });
    assert(file.trim() === html.trim(), 'output is exactly the same');
  });

  it('should insert http', function() {
    var file = toFile(
      { html: html, javascript: '', css: '' },
      { proto: 'http' }
    );

    var $ = cheerio.load(html);
    $('script').each(function() {
      var src = $(this).attr('src');

      if (src.slice(0, 2) === '//') {
        assert(
          file.indexOf('http:' + src) !== -1,
          'relative protocol on ' + src
        );
      }
    });

    assert(file.trim() !== html.trim(), 'output is different');
  });

  it('should insert https', function() {
    var file = toFile(
      { html: html, javascript: '', css: '' },
      { proto: 'https' }
    );

    var $ = cheerio.load(html);
    $('script').each(function() {
      var src = $(this).attr('src');

      if (src.slice(0, 2) === '//') {
        assert(
          file.indexOf('https:' + src) !== -1,
          'relative protocol on ' + src
        );
      }
    });

    assert(file.trim() !== html.trim(), 'output is different');
  });
});
