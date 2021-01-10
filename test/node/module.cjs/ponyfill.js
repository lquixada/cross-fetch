require('../setup.server')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addModuleSuite = require('../../ponyfill.spec')

describe('Node: require ponyfill on Webpack bundle', () => {
  addModuleSuite({
    ...ponyfill,
    defaultExport: fetch
  })
})
