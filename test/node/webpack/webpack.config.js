const path = require('path')

module.exports = ['cjs', 'esm'].map(format => ({
  target: 'node',
  mode: 'none',
  entry: path.join(__dirname, `index.${format}.js`),
  output: {
    path: __dirname,
    filename: `test.${format}.js`
  },
  stats: 'none'
}))
