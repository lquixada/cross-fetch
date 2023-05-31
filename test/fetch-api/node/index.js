
if (global.fetch) {
  const addFetchSuite = require('../api.spec')

  describe('Node:Fetch:Native', () => {
    addFetchSuite()
  })
} else {
  console.log('Skipping tests as this Node version does not have a native fetch.')
}
