import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';
const ext = production ? 'min.js' : 'js';

module.exports = {
  input: 'polyfill/fetch-browser.js',
  output: {
    file: `dist/polyfill/fetch-browser.${ext}`,
    format: 'umd',
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
