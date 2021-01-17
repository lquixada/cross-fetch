// Enable mocha's bdd style
mocha.setup('bdd')

// Add chai's expect to the global scope
window.expect = chai.expect
window.assert = chai.assert

if (/globals=off/.test(location.search)) {
  // Delete native fetch api to force the polyfill installation for test purposes
  delete window.fetch
  delete window.Request
  delete window.Response
  delete window.Headers
}
