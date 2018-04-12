'use strict';
/*global describe, it, beforeEach */
var assert = require('assert');
var toFile = require('../lib');
var fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
var path = require('path');

function metadata({
  url,
  revision,
  user = 'anonymous',
  year = new Date().getFullYear(),
}) {
  return `<!--

‣ Created using JS Bin - https://jsbin.com
‣ Copyright (c) ${year} by @${user} - https://jsbin.com/${url}/${revision}/edit
‣ Released under the MIT license - https://jsbin.mit-license.org

-->
<meta name="robots" content="noindex">`;
}

describe('content insert', function() {
  var html = '';

  beforeEach(function() {
    html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'simple.html'),
      'utf8'
    );
  });

  it('should insert JS before the closing body', function() {
    var javascript = 'alert("Hello world");';
    var file = toFile({ html, javascript });

    assert(file.indexOf(javascript) !== -1, 'contains the javascript: ' + file);

    var lines = file.split('\n');
    var pos = lines.findIndex(line => line.includes(javascript));
    assert(lines[pos + 2].indexOf('</body>') === 0);
  });

  it('should insert CSS before the closing head', function() {
    var css = 'body { background: red; }';
    var file = toFile({ html: html, css: css });

    assert(file.indexOf(css) !== -1, 'contains the css: ' + file);

    var lines = file.split('\n');
    var pos = lines.indexOf(css);
    assert(lines[pos + 2].indexOf('</head>') === 0, lines[pos + 2]);
  });

  it('should load after <title>', function() {
    var html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'barebones.html'),
      'utf8'
    );
    var css = 'body { background: red; }';
    var file = toFile({ html: html, css: css });

    expect(file).toEqual(expect.stringContaining(css));
    expect(file).toEqual(expect.stringContaining('</title>'));
  });

  it('should insert JS at end when missing </body>', function() {
    var html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'barebones.html'),
      'utf8'
    );
    var javascript = 'alert("Hello world");';
    var file = toFile({ html: html, javascript: javascript });

    assert(file.indexOf(javascript) !== -1, 'contains the javascript: ' + file);

    var lines = file.split('\n');

    assert(lines.slice(-1)[0] === '</script>', '???: ' + lines.slice(-2));
  });
});
