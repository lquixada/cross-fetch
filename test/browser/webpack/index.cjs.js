require('../../../polyfill')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addModuleSuite = require('../../module.spec')

addModuleSuite('Browser: require on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
