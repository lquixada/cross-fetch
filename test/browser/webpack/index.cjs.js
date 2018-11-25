require('../../../dist/browser-polyfill')

const fetch = require('../../../dist/browser-ponyfill')
const ponyfill = require('../../../dist/browser-ponyfill')
const addSuite = require('../../module.spec')

ponyfill.defaultExport = fetch

addSuite('Browser: require on Webpack bundle', ponyfill)
