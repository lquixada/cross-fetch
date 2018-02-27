import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import uglify from 'rollup-plugin-uglify';

const input = path.join(__dirname, 'src', 'browser-polyfill.js');

// Removes indentation from all the lines in the string
const outdent = str => str.replace(/^\s*/mg, '');

export default [
  // Ponyfill for commonjs usage via require('cross-fetch')
  {
    input,
    output: {
      file: path.join(__dirname, 'dist', 'browser.js'),
      format: 'cjs',
      strict: false,
      banner: outdent(`
        var Self = function () { this.fetch = false; };
        Self.prototype = window;
        var self = new Self;
      `),
      footer: outdent(`
        var fetch = self.fetch;

        fetch.fetch = fetch;
        fetch.Response = self.Response;
        fetch.Headers = self.Headers;
        fetch.Request = self.Request;

        // fetch now can be imported as the default object
        module.exports = fetch;
      `)
    },
    plugins: [
      resolve(),
      copy({
        'src/node.js': 'dist/node.js',
        verbose: true
      })
    ],
    context: 'this'
  },

  // Polyfill for commonjs usage via require('cross-fetch/polyfill')
  {
    input,
    output: {
      file: path.join(__dirname, 'dist', 'browser-polyfill.js'),
      format: 'cjs',
      strict: false
    },
    plugins: [
      resolve(),
      copy({
        'src/node-polyfill.js': 'dist/node-polyfill.js',
        verbose: true
      })
    ],
    context: 'this'
  },

  // For browser usage via <script> tag.
  {
    input,
    output: {
      file: path.join(__dirname, 'dist', 'cross-fetch.js'),
      format: 'cjs',
      sourcemap: true,
      strict: false
    },
    plugins: [
      resolve(),
      uglify(),
    ],
    context: 'this'
  }
];
