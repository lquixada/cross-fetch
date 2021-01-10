require('../setup.server')
require('../../../dist/node-polyfill')

const addFetchSuite = require('../../fetch.spec')

describe('Node: compliance check with Fetch API specs', () => {
  addFetchSuite()
})
