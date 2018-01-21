const fs = require('fs');
const readdir = fs.readdirSync;
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const base = __dirname + '/fixtures/bins';
const fixtures = readdir(base);
const binToFile = require('../');

describe('bin fixtures', () => {
  fixtures
    .filter(f => f.endsWith('.json'))
    .map(f => [`${base}/${f}`, f])
    .forEach(([filename, fixture]) => {
      it(fixture, async () => {
        const bin = await readFile(filename, 'utf8');
        const html = binToFile(JSON.parse(bin));

        const expecting = await readFile(
          filename.replace(/\.json$/, '.html'),
          'utf8'
        );
        expect(html).toEqual(expecting.trim());
      });
    });
});
