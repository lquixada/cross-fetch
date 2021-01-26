require('../../../dist/node-polyfill')

const addFetchSuite = require('../api.spec')
const { addPolyfillSuite } = require('../../module/module.spec')

describe('Node:Fetch', () => {
  addFetchSuite()
  addPolyfillSuite({ fetch })
})
