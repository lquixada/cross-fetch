require('../setup')
require('../../../dist/node-polyfill')

const addSuite = require('../../fetch.spec')
addSuite('Node: implementation of the Fetch API')
