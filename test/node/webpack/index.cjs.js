require('../setup')
require('../../../polyfill')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addModuleSuite = require('../../module.spec')

addModuleSuite('Node: require on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
