require('../setup.env')
require('../../../polyfill')
const addModuleSuite = require('../../polyfill.spec')

addModuleSuite('Browser: require polyfill on Webpack bundle')

mocha.checkLeaks()
mocha.run()
