require('../setup')
require('../../../dist/node-polyfill')

const fetch = require('../../../dist/node-ponyfill')
const ponyfill = require('../../../dist/node-ponyfill')
const addSuite = require('../../module.spec')

ponyfill.defaultExport = fetch

addSuite('Node: require on Webpack bundle', ponyfill)
