require('../setup')
require('../../../polyfill')

const fetch = require('../../..')
const ponyfill = require('../../..')
const addSuite = require('../../module.spec')

ponyfill.defaultExport = fetch

addSuite('Node: require on Webpack bundle', ponyfill)
