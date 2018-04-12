const assert = require('assert');
const { afterLine } = require('../lib/');

test('inserts below html', () => {
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
  <title>Sandbox</title>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <style type="text/css" media="screen">
  body { background-color: #000; font: 16px Helvetica, Arial; color: #fff; }
  #debug { font-weight: bold; color: #c00; }
  </style>
  </head>`;

  const meta = `<!--
    Created using JS Bin https://jsbin.com

    Copyright (c) 2018 by anonymous (https://jsbin.com/iwume/1/edit)

    Released under the MIT license: https://jsbin.mit-license.org
    -->
    <meta name="robots" content="noindex">
`;

  const res = afterLine(html, '<html', meta);

  expect(res).not.toBe(null);
  expect(res.split('\n')[0]).toBe(html.split('\n')[0]);
});
