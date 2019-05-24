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
        var __self__ = (function (root) {
          function F() { this.fetch = false; }
          F.prototype = root;
          return new F();
        })(typeof self !== 'undefined' ? self : this);

        (function(self) {
      `),
      footer: outdent(`
        })(__self__);

        delete __self__.fetch.polyfill

        exports = __self__.fetch // To enable: import fetch from 'cross-fetch'
        exports.default = __self__.fetch // For TypeScript consumers without esModuleInterop.
        exports.fetch = __self__.fetch // To enable: import {fetch} from 'cross-fetch'
        exports.Headers = __self__.Headers
        exports.Request = __self__.Request
        exports.Response = __self__.Response

        module.exports = exports
      `)
    },
    plugins: [
      copy({
        targets: {
          'src/node-ponyfill.js': 'dist/node-ponyfill.js',
          'src/react-native-ponyfill.js': 'dist/react-native-ponyfill.js'
        },
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
        targets: {
          'src/node-polyfill.js': 'dist/node-polyfill.js',
          'src/react-native-polyfill.js': 'dist/react-native-polyfill.js'
        },
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
