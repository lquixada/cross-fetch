const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  stats: 'none'
}
