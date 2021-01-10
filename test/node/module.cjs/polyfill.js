require('../setup.server')
require('../../../polyfill')

const addModuleSuite = require('../../polyfill.spec')

describe('Node: require polyfill on Webpack bundle', () => {
  addModuleSuite()
})
