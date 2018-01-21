'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../lib');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

describe('js only', function() {
  var js = '';

  beforeEach(function() {
    js = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple.js'), 'utf8');
  });

  it('should have fixtures', function() {
    assert(js.length > 0, 'fixture js has content');
  });

  it('does nothing to plain js', function() {
    var file = toFile({ javascript: js, url: 'foo', revision: 10 });

    var $ = cheerio.load(file);
    var outputJS = $('#jsbin-javascript').text();

    assert(js.trim() === outputJS.trim(), 'content matches');
  });
});

describe('css only', function() {
  var css = '';

  beforeEach(function() {
    css = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'simple.css'),
      'utf8'
    );
  });

  it('should have fixtures', function() {
    assert(css.length > 0, 'fixture css has content');
  });

  it('does nothing to plain css', function() {
    var file = toFile({ css: css });

    var $ = cheerio.load(file);
    var outputCSS = $('#jsbin-css').text();

    assert(outputCSS.trim() === css.trim(), 'content matches');
  });
});
