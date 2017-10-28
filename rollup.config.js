import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';

module.exports = [
  // Ponyfill (wraps polyfill with banner and footer)
  {
    input: path.join(__dirname, 'browser-polyfill.js'),
    output: {
      file: path.join(__dirname, 'dist', 'browser.js'),
      format: 'cjs',
      strict: false
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      production && uglify(),
    ],
    context: 'this',
    banner: 'var self = {};',
    footer: 'module.exports = self;'
  },

  // Polyfill
  {
    input: path.join(__dirname, 'browser-polyfill.js'),
    output: [{
      file: path.join(__dirname, 'dist',  'browser-polyfill.js'),
      format: 'cjs',
      strict: false
    },{
      file: path.join(__dirname, 'dist',  'cross-fetch.js'),
      format: 'cjs',
      sourcemap: true,
      strict: false
    }],
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      production && uglify(),
    ],
    context: 'this'
  }
];
