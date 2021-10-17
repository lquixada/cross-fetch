/* Rollup creates the browser version of the polyfill and ponyfill. */
import path from 'path'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

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
        // Save global object in a variable
        var __global__ =
          (typeof globalThis !== 'undefined' && globalThis) ||
          (typeof self !== 'undefined' && self) ||
          (typeof global !== 'undefined' && global);

        // Create an object that extends from __global__ without the fetch function
        var __globalThis__ = (function () {
          function F() {
            this.fetch = false;
            this.DOMException = __global__.DOMException
          }
          F.prototype = __global__; // Needed for feature detection on whatwg-fetch's code
          return new F();
        })();

        // Wraps whatwg-fetch with a function scope to hijack the global object
        // "globalThis" that's going to be patched
        (function(globalThis) {
      `),
      footer: outdent(`
        })(__globalThis__);

        // This is a ponyfill, so...
        __globalThis__.fetch.ponyfill = true;
        delete __globalThis__.fetch.polyfill;

        // Choose between native implementation (__global__) or custom implementation (__globalThis__)
        var ctx = __global__.fetch ? __global__ : __globalThis__;

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
      terser()
    ]
  }
]
