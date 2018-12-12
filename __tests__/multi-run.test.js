/* eslint-env jest */
const toFile = require('../lib');
const fileToBin = require('file-to-bin');
const fs = require('fs');
const path = require('path');

describe('stripped and repeatedly converted', function() {
  var html = '';

  beforeEach(function() {
    html = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'stripped.html'),
      'utf8'
    );
  });

  it('should have fixtures', function() {
    expect(html.length).toBeGreaterThan(0);
  });

  it('does nothing to plain html', function() {
    const bin = fileToBin(html);
    bin.url = 'abc-def-ghi';
    // bin.meta = `<!-- source: https://jsbin.com/${bin.url}/edit -->
    // <meta http-equiv="CACHE-CONTROL" content="NO-CACHE">`;
    const file = toFile(bin);
    const parsed = fileToBin(file);

    expect(parsed.html).toEqual(bin.html);
    expect(parsed.url).toEqual(bin.url);

    expect(toFile(parsed)).toEqual(toFile(bin));
  });
});
