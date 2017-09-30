import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import uglify from 'rollup-plugin-uglify';

module.exports = {
  input: 'fetch-browser.js',
  name: 'blah',
  output: {
    file: 'dist/fetch-browser.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    // uglify(),
  ]
};
