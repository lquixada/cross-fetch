import '../setup.server'
import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../ponyfill.spec'

describe('Node: import ponyfill on Webpack bundle', () => {
  addModuleSuite({
    ...ponyfill,
    defaultExport: fetch
  })
})
