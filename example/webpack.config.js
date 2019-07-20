const path = require('path')

module.exports = [{
  target: 'web',
  mode: 'development',
  entry: './github.js',
  output: {
    path: path.join(__dirname, 'web'),
    filename: 'bundle.js'
  }
}, {
  target: 'node',
  mode: 'development',
  entry: './github.js',
  output: {
    path: path.join(__dirname, 'node'),
    filename: 'bundle.js'
  }
}
]
