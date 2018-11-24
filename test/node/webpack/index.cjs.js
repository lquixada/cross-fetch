require('../setup')
require('../../../dist/node-polyfill')

const ponyfill = require('../../../dist/node-ponyfill')
const addSuite = require('../../module.spec')

addSuite('Node: require on Webpack bundle', ponyfill)
