require('../setup.server')
require('../../../dist/node-polyfill')

const addFetchSuite = require('../../fetch.spec')
addFetchSuite('Node: compliance check with Fetch API specs')
