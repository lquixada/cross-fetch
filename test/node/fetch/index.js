require('../../../dist/node-polyfill')

const addFetchSuite = require('../../fetch.spec')
const { addPolyfillSuite } = require('../../module.spec')

describe('Node: compliance check with Fetch API specs', () => {
  addFetchSuite()
  addPolyfillSuite({ fetch })
})
