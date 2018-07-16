const doctypeRe = new RegExp(/^<!doctype[^>]*>\n?/im);

function afterLine(source, needle, value) {
  if (!source.toLowerCase().includes(needle.toLowerCase())) {
    return null;
  }

  let found = false;
  const res = source
    .split('\n')
    .reduce((acc, curr) => {
      acc.push(curr);
      if (
        !found &&
        curr
          .trim()
          .toLowerCase()
          .startsWith(needle)
      ) {
        acc.push(value.trim());
        found = true;
      }

      return acc;
    }, [])
    .join('\n');

  return found ? res : null;
}

function insert(source, needle, value, after = false) {
  needle = needle.toLowerCase();
  const sourceLC = source.toLowerCase();
  if (!sourceLC.includes(needle)) {
    return null;
  }

  let left = source.substring(0, sourceLC.lastIndexOf(needle));

  let ri = sourceLC.lastIndexOf(needle);

  if (after) {
    ri += needle.length;
    left += needle + '\n';
  }

  const right = source.substring(ri);

  if (left && right) {
    return left + value + right;
  }
  return '';
}

function safeForHTML(s) {
  return (s || '')
    .replace(/<\/script>/gi, '<\\/script>')
    .replace(/<!--/g, '<\\!--');
}

function binToFile(bin, options = {}) {
  if (!bin) {
    console.error('binToFile requires bin object', new Error().stack);
    return '<!DOCTYPE html>';
  }

  // allows for the proto to be '' (not sure why you'd want that though...)
  let proto = options.proto !== undefined ? options.proto : 'https:';

  // protect myself from idiots, like me.
  if (proto && proto.slice(-1) !== ':') {
    proto += ':';
  }

  let file = '';
  let html = (bin.html || '').replace(/(\r\n)/g, '\n'); // remove windows nl.
  let css = safeForHTML(bin.css);
  let javascript = safeForHTML(bin.javascript);
  const { source, processors = {} } = bin;
  const binId = [bin.url, bin.revision].filter(Boolean).join('/');
  let meta =
    bin.meta ||
    (bin.url ? `<!-- source: https://jsbin.com/${binId}/edit -->\n` : '');

  // insert protocol if missing
  html = html.replace(/(src|href)=('|")\/\//g, '$1=$2' + proto + '//');

  if (meta && meta.slice(-1) !== '\n') {
    meta += '\n'; // a nice new line for the meta data
  }

  /**
   * 1. strip the doctype and print it then add comment (<!-- file... etc)
   * 2. in remaining code:
   *   - is there %css%?
   *    yes: replace with CSS
   *    no: look for head - is there head?
   *      yes: insert style tag
   *      no: try after the <title> tag, or prepend to top: <style>css</style>
   *   - is there %code%
   *    yes: replace with JS
   *    no: look for closing </body> - is there closing </body>
   *      yes: insert above this
   *      no: append to end (closing HTML?)
   *   - is there closing body or html?
   *     yes: insert "source script tags" above
   *     no: append source scripts
   *
   */

  file = html;

  if (css) {
    if (file.includes('%css%')) {
      file = file.split('%css%').join(bin.css);
    } else {
      // is there head tag?
      css = `<style id="jsbin-css">\n${css}\n</style>\n`;
      const head = insert(file, '</head>', css);
      if (head) {
        file = head;
      } else {
        const title = insert(file, '</title>', css, true);
        if (title) {
          file = title;
        } else {
          // slap on the top (note that this is *before* the doctype)
          file = css + file;
        }
      }
    }
  }

  // try to insert above the head
  if (meta) {
    const afterHTML = afterLine(file, '<html', meta);
    if (afterHTML) {
      file = afterHTML;
    } else {
      // only look for a doctype at the top of the document
      const doctype =
        (html
          .trim()
          .split('\n')
          .shift()
          .trim()
          .match(doctypeRe) || [])[0] || '';

      if (doctype) {
        file = file.replace(doctypeRe, `${doctype}\n${meta}`);
        // strip from original html
      } else {
        file = meta + file;
      }
    }
  }

  if (javascript) {
    if (file.includes('%code%')) {
      file = file.split('%code%').join(javascript);
    } else {
      // is there head tag?
      const hasModule = javascript.includes('import ');
      javascript = `<!--boot js-->\n<script id="jsbin-javascript" ${
        hasModule ? 'type="module" ' : ''
      }defer>\n${javascript}\n</script>`;

      const body = insert(file, '</body>', javascript + '\n');
      if (body) {
        file = body;
      } else {
        // slap on the bottom
        file = `${file}\n${javascript}`;
      }
    }
  }

  // If we have the raw panel content - go ahead and stick that in scripts at the bottom.
  if (source) {
    if (source.css === css) {
      delete source.css;
    }
    if (source.javascript === javascript) {
      delete source.javascript;
    }
    if (source.html === html) {
      delete source.html;
    }

    const sourceScripts = ['html', 'css', 'javascript']
      .map(type => {
        if (source[type] === undefined) {
          return '';
        }

        const content = safeForHTML(source[type]);
        if (content) {
          return `\n<script id="jsbin-source-${type}" type="text/source-${processors[
            type
          ] || type}">${content}\n</script>`;
        }

        return '';
      })
      .join('\n');

    const bodyTag = insert(file, '</body>', sourceScripts);
    if (bodyTag) {
      file = bodyTag;
    } else {
      file += sourceScripts;
    }
  }

  return file;
}

if (typeof module !== 'undefined') {
  module.exports = binToFile;
  module.exports.afterLine = afterLine;
  if (!module.parent) {
    // cli mode
    if (process.stdin && !process.stdin.isTTY) {
      const stdinBuffer = require('fs').readFileSync(0); // STDIN_FILENO = 0
      console.log(module.exports(JSON.parse(stdinBuffer.toString())));
    }
  }
}
