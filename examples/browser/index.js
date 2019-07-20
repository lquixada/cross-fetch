const fetch = require('cross-fetch')

fetch('https://api.github.com/users/lquixada')
  .then(res => {
    if (res.status >= 400) {
      throw new Error('Bad response from server')
    }
    return res.json()
  })
  .then(user => {
    console.log(user)
  })
  .catch(err => {
    console.error(err)
  })
