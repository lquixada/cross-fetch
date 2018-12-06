require('../setup')
require('../../../dist/node-polyfill')

const addFetchSuite = require('../../fetch.spec')
addFetchSuite('Node: implementation of the Fetch API')
