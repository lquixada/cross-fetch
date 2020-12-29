const fetch = require('../../..')
const namedExports = require('../../..')
const addModuleSuite = require('../../ponyfill.spec')

addModuleSuite('Browser: require ponyfill on Webpack bundle', {
  ...namedExports,
  defaultExport: fetch
})
