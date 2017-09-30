import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';

module.exports = {
  input: 'fetch-browser.js',
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
  banner: 'var self = {};',
  footer: 'module.exports = self;'
};
