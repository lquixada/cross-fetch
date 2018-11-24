const path = require('path')

module.exports = [{
  mode: 'none',
  entry: path.join(__dirname, 'index.cjs.js'),
  output: {
    path: __dirname,
    filename: 'bundle.cjs.js'
  },
  stats: 'none'
}, {
  mode: 'none',
  entry: path.join(__dirname, 'index.esm.js'),
  output: {
    path: __dirname,
    filename: 'bundle.esm.js'
  },
  stats: 'none'
}]
