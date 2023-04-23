require('../../setup/node.env')
require('../../../dist/node-polyfill')

const addFetchSuite = require('../api.spec')
const { addPolyfillSuite } = require('../../module-system/module.spec')

describe('Node:Fetch:node-fetch', () => {
  addFetchSuite()
  addPolyfillSuite({ fetch })
})
