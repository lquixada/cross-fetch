import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.RU_ENV === 'production';
const polyfill = process.env.RU_TYPE === 'polyfill';

module.exports = {
  input: 'fetch-browser-polyfill.js',
  output: {
    file: path.join('dist', `fetch-browser${polyfill ? '-polyfill' : ''}.js`),
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
  banner: polyfill? '' : 'var self = {};',
  footer: polyfill? '': 'module.exports = self;'
};
