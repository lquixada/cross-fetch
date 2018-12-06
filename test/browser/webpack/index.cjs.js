require('../../../polyfill')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addModuleSuite = require('../../module.spec')

ponyfill.defaultExport = fetch

addModuleSuite('Browser: require on Webpack bundle', ponyfill)
