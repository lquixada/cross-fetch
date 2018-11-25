require('../../../polyfill')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addSuite = require('../../module.spec')

ponyfill.defaultExport = fetch

addSuite('Browser: require on Webpack bundle', ponyfill)
