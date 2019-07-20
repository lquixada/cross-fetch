const nock = require('nock')

const reply = function (uri, reqBody) {
  const reqHeaders = Object.assign({}, this.req.headers)
  const resHeaders = {
    'Content-Type': 'application/json',
    Date: 'Sat, 23 Sep 2017 15:41:16 GMT-0300'
  }

  for (const key in reqHeaders) {
    const value = reqHeaders[key]
    reqHeaders[key] = Array.isArray(value) ? value[0] : value
  }

  return [
    200,
    JSON.stringify({
      method: this.method,
      headers: reqHeaders,
      body: reqBody || ''
    }),
    resHeaders
  ]
}

before(() => {
  nock('https://fet.ch')
    .persist()
    .get('/succeed').reply(200, 'hello world.')
    .get('/fail').reply(404, 'good bye world.')
    .get('/error').reply(500, 'error world.')
    .get('/request').reply(reply)
    .post('/request').reply(reply)
    .put('/request').reply(reply)
    .delete('/request').reply(reply)
    .patch('/request').reply(reply)
})
