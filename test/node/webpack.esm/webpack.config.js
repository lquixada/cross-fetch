const path = require('path')

module.exports = ['polyfill', 'ponyfill'].map(method => ({
  target: 'node',
  mode: 'none',
  entry: path.join(__dirname, `${method}.js`),
  output: {
    path: __dirname,
    filename: `test.${method}.js`
  },
  stats: 'none'
}))
