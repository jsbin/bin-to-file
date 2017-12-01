'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

describe('full bin insert', function() {
  var html = '';

  beforeEach(function() {
    html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'simple.html'),
      'utf8'
    );
  });

  it('should also store source panel content', function() {
    var javascript = 'alert("Hello world");';
    var css = 'body { background: red; }';
    var meta = '<!-- test -->';
    var modifiedHTML = html + '<!-- tested -->\n<script>alert("foo");</script>';
    var file = toFile({
      html: html,
      javascript: javascript,
      css: css,
      meta: meta,
      source: {
        html: modifiedHTML,
        javascript: javascript + '\n// tested',
        css: css + '\n/* tested */',
      },
    });

    var $ = cheerio.load(file, { xmlMode: false, decodeEntities: false });
    var sourceHTML = $('#jsbin-source-html').text();

    assert(
      sourceHTML.indexOf('<\\!-- tested -->') !== -1,
      'source HTML is present'
    );

    $ = cheerio.load(
      sourceHTML.replace(/<\\!--/, '<!--').replace(/<\\\/script>/i, '</script>')
    );

    assert(
      $.html().trim() === modifiedHTML.trim(),
      'pulling HTML back out is correct'
    );
  });
});
