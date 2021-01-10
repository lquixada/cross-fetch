require('../setup.env')
const fetch = require('../../..')
const namedExports = require('../../..')
const addModuleSuite = require('../../ponyfill.spec')

describe('Browser: require ponyfill on Webpack bundle', () => {
  addModuleSuite({
    ...namedExports,
    defaultExport: fetch
  })
})

mocha.checkLeaks()
mocha.run()
