import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';
const config = {};

config.ponyfill = {
  input: 'browser-polyfill.js',
  output: {
    file: 'dist/browser.js',
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
};

config.polyfill = {
  input: 'browser-polyfill.js',
  output: [{
    file: 'dist/browser-polyfill.js',
    format: 'cjs',
    strict: false
  },{
    file: 'dist/cross-fetch.js',
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
};

module.exports = [
  config.ponyfill,
  config.polyfill
];
