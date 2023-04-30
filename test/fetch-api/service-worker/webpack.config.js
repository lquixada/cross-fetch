const path = require('path')

module.exports = {
  target: 'webworker',
  mode: 'none',
  entry: path.join(__dirname, 'sw.js'),
  output: {
    path: __dirname,
    filename: 'sw.bundle.js'
  },
  stats: 'none'
}
