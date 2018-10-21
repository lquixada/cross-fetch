/* Rollup creates the browser version of the polyfill and ponyfill. */
import path from 'path'
import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'

const input = path.join(__dirname, 'node_modules', 'whatwg-fetch', 'fetch.js')

const outdent = str => str.replace(/^\s*/mg, '')

export default [
  // Ponyfill for commonjs usage via require('cross-fetch')
  // Wraps up the whatwg-fetch code in order to prevent
  // it from adding fetch to the global object.
  {
    input,
    output: {
      file: path.join(__dirname, 'dist', 'browser-ponyfill.js'),
      format: 'cjs',
      strict: false,
      banner: outdent(`
        var __root__ = (function (root) {
          function F() { this.fetch = false; }
          F.prototype = root;
          return new F();
        })(typeof self !== 'undefined' ? self : this);

        (function(self) {
      `),
      footer: outdent(`
        }).call(__root__, void(0));

        var fetch = __root__.fetch;
        var Response = fetch.Response = __root__.Response;
        var Request = fetch.Request = __root__.Request;
        var Headers = fetch.Headers = __root__.Headers;

        if (typeof module === 'object' && module.exports) {
          module.exports = fetch;
          // Needed for TypeScript consumers without esModuleInterop.
          module.exports.default = fetch;
        }
      `)
    },
    plugins: [
      copy({
        'src/node-ponyfill.js': 'dist/node-ponyfill.js',
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
      uglify()
    ],
    context: 'this'
  }
]
