const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.webpack': JSON.stringify(true)
    })
  ],
  stats: 'none'
}
