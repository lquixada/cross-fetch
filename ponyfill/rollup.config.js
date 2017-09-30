import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const production = process.env.NODE_ENV === 'production';
const ext = production ? 'min.js' : 'js';

module.exports = {
  input: 'ponyfill/fetch-browser.js',
  output: {
    file: `dist/ponyfill/fetch-browser.${ext}`,
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
