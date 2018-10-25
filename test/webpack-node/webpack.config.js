const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.join(__dirname, '..', 'node', 'index.js'),
  output: {
    path: __dirname,
    filename: 'index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.webpack': JSON.stringify(true)
    })
  ]
}
