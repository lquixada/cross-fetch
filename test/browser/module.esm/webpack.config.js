const path = require('path')

module.exports = ['polyfill', 'ponyfill'].map(method => ({
  target: 'web',
  mode: 'none',
  entry: path.join(__dirname, `${method}.js`),
  output: {
    path: __dirname,
    filename: `test.${method}.js`
  },
  stats: 'none'
}))
