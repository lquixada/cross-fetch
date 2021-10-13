require('../../../dist/node-polyfill')

const addFetchSuite = require('../api.spec')
const { addPolyfillSuite } = require('../../module-system/module.spec')

describe('Node:Fetch', () => {
  addFetchSuite()
  addPolyfillSuite({ fetch })
})
