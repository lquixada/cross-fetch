import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';

module.exports = {
  input: 'polyfill/fetch-browser.js',
  output: {
    file: 'dist/polyfill/fetch-browser.js',
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
