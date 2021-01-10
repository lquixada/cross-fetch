require('../setup.env')
require('../../../polyfill')
const addModuleSuite = require('../../polyfill.spec')

describe('Browser: require polyfill on Webpack bundle', () => {
  addModuleSuite()
})

mocha.checkLeaks()
mocha.run()
