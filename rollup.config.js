import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import uglify from 'rollup-plugin-uglify';

module.exports = [
  // Ponyfill for commonjs usage via require('cross-fetch')
  {
    input: path.join(__dirname, 'src', 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist', 'browser.js'),
      format: 'cjs',
      strict: false
    },
    plugins: [
      resolve(),
      copy({
        'src/node.js': 'dist/node.js',
        verbose: true
      })
    ],
    context: 'this',
    banner: 'var self = {};',
    footer: 'module.exports = self;'
  },

  // Polyfill for commonjs usage via require('cross-fetch/polyfill')
  {
    input: path.join(__dirname, 'src', 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist',  'browser-polyfill.js'),
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
    input: path.join(__dirname, 'src', 'browser-polyfill.js'),
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
