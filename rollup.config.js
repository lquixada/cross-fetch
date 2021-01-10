/* Rollup creates the browser version of the polyfill and ponyfill. */
import path from 'path'
import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'

const input = path.join(__dirname, 'node_modules', 'whatwg-fetch', 'fetch.js')

const outdent = str => str.replace(/^\s*/mg, '')

export default [
  /**
   * Ponyfill for CommonJS or EcmaScript Modules
   * Description:
   *   Wraps up the whatwg-fetch code in order to prevent it from adding fetch to
   *   the global object.
   * Usage examples:
   * - const fetch = require('cross-fetch')
   * - import fetch from 'cross-fetch')
   */
  {
    input,
    output: {
      file: path.join(__dirname, 'dist', 'browser-ponyfill.js'),
      format: 'iife',
      name: 'irrelevant',
      strict: false,
      banner: outdent(`
        var global = typeof self !== 'undefined' ? self : this;
        var __self__ = (function () {
          function F() {
            this.fetch = false;
            this.DOMException = global.DOMException
          }
          F.prototype = global;
          return new F();
        })();

        (function(self) {
      `),
      footer: outdent(`
        })(__self__);

        __self__.fetch.ponyfill = true;

        // Remove "polyfill" property added by whatwg-fetch
        delete __self__.fetch.polyfill;

        // Choose between native implementation (global) or custom implementation (__self__)
        var ctx = global.fetch ? global : __self__;

        exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
        exports.default = ctx.fetch // For TypeScript consumers without esModuleInterop.
        exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
        exports.Headers = ctx.Headers
        exports.Request = ctx.Request
        exports.Response = ctx.Response

        module.exports = exports
      `)
    },
    plugins: [
      copy({
        targets: [
          { src: 'src/*-ponyfill.js', dest: 'dist' }
        ],
        verbose: true
      })
    ],
    context: 'this'
  },

  /**
   * Polyfill for CommonJS or EcmaScript Modules
   * Usage examples:
   * - require('cross-fetch/polyfill')
   * - import 'cross-fetch/polyfill'
   */
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
        targets: [
          { src: 'src/*-polyfill.js', dest: 'dist' }
        ],
        verbose: true
      })
    ],
    context: 'this'
  },

  /**
   * Browser
   * Usage examples:
   * - <script src="cross-fetch.js"></script>
   */
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
