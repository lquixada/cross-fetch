import path from 'path';
import copy from 'rollup-plugin-copy';
import uglify from 'rollup-plugin-uglify';

const input = path.join(__dirname, 'node_modules', 'whatwg-fetch', 'fetch.js');

// Removes indentation from all the lines in the string
const outdent = str => str.replace(/^\s*/mg, '');

export default [
  // Ponyfill for commonjs usage via require('cross-fetch')
  // Wraps up the whatwg-fetch code on ponyfill mode in order
  // to prevent it from adding fetch to the global object.
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

        // This "if" allows the output file to be run on browser environment (useful for tests).
        if (typeof module === 'object' && module.exports) {
          module.exports = fetch;
        }
      `)
    },
    plugins: [
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
      uglify(),
    ],
    context: 'this'
  }
];
