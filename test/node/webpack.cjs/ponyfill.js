require('../setup.server')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addModuleSuite = require('../../ponyfill.spec')

addModuleSuite('Node: require ponyfill on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
