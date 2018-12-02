// Enable mocha's bdd style
mocha.setup('bdd')

// Add chai's expect to the global scope
window.expect = chai.expect
window.assert = chai.assert

// Delete native fetch api to force the polyfill installation for test purposes
delete window.fetch
delete window.Request
delete window.Response
delete window.Headers

// Enable fake server
before(function () {
  this.server = sinon.createFakeServer({ autoRespond: true })

  this.server.respondWith('GET', 'https://fet.ch/succeed',
    [200, { 'Content-Type': 'text/plain' }, 'hello world.'])

  this.server.respondWith('GET', 'https://fet.ch/fail',
    [404, { 'Content-Type': 'text/plain' }, 'good bye world.'])

  this.server.respondWith('GET', 'https://fet.ch/error',
    [500, { 'Content-Type': 'text/plain' }, 'error world.'])

  this.server.respondWith('GET', 'https://fet.ch/json',
    [200, { 'Content-Type': 'application/json' }, '{"msg": "hello world."}'])

  this.server.respondWith('https://fet.ch/request', function (xhr) {
    xhr.respond(200, {
      'Content-Type': 'application/json',
      'Date': 'Sat, 23 Sep 2017 15:41:16 GMT-0300'
    }, JSON.stringify({
      method: xhr.method,
      headers: xhr.requestHeaders,
      body: xhr.requestBody || ''
    }))
  })
})

after(function () {
  this.server.restore()
})
