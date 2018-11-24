require('../../../dist/browser-polyfill')

const ponyfill = require('../../../dist/browser-ponyfill')
const addSuite = require('../../module.spec')

addSuite('Browser: require on Webpack bundle', ponyfill)
