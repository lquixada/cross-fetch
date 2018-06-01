const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  stats: 'minimal'
};
