var toFile = require('../lib');
var fs = require('fs');
var path = require('path');

var html = '';

beforeEach(function() {
  html = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'simple.html'),
    'utf8'
  );
});

test('should insert JS at end when missing </body>', function() {
  var file = toFile({ html: html, javascript: '', css: '' });

  file = file.replace(/<!--hash:.*?-->\n/, '');

  expect(file).toEqual(html);
});
