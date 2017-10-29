import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';


module.exports = [
  // Ponyfill for webpack usage via require('cross-fetch')
  {
    input: path.join(__dirname, 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist', 'browser.js'),
      format: 'cjs',
      strict: false
    },
    plugins: [
      resolve(),
    ],
    context: 'this',
    banner: 'var self = {};',
    footer: 'module.exports = self;'
  },

  // Polyfill for webpack usage via require('cross-fetch/polyfill')
  {
    input: path.join(__dirname, 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist',  'browser-polyfill.js'),
      format: 'cjs',
      strict: false
    },
    plugins: [
      resolve(),
    ],
    context: 'this'
  },

  // For browser usage via <script> tag.
  {
    input: path.join(__dirname, 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist',  'cross-fetch.js'),
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
