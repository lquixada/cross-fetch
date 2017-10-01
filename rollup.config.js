import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';
const config = {};

config.ponyfill = {
  input: 'fetch-browser-polyfill.js',
  output: {
    file: 'dist/fetch-browser.js',
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
  input: 'fetch-browser-polyfill.js',
  output: {
    file: 'dist/fetch-browser-polyfill.js',
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
  context: 'this'
};

module.exports = [
  config.ponyfill,
  config.polyfill
];
