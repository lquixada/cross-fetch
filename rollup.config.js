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
      format: 'iife',
      name: 'irrelevant',
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
        })(__root__);

        delete __root__.fetch.polyfill

        module.exports = exports = __root__.fetch
        exports.fetch = __root__.fetch
        exports.Headers = __root__.Headers
        exports.Request = __root__.Request
        exports.Response = __root__.Response

        // Needed for TypeScript consumers without esModuleInterop.
        exports.default = __root__.fetch
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
      format: 'iife',
      name: 'irrelevant',
      strict: false,
      banner: outdent(`
        (function(self) {
      `),
      footer: outdent(`
        })(typeof self !== 'undefined' ? self : this);
      `)
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
      format: 'iife',
      name: 'irrelevant',
      sourcemap: true,
      strict: false,
      banner: outdent(`
        (function(self) {
      `),
      footer: outdent(`
        })(typeof self !== 'undefined' ? self : this);
      `)
    },
    plugins: [
      uglify()
    ]
  }
]
