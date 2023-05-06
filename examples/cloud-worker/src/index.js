import _fetch from '../../../'

export default {
  async fetch (request, env, ctx) {
    try {
      const res = await _fetch('https://jsonplaceholder.typicode.com/todos/1')

      if (res.status >= 400) {
        const err = new Error(`${res.status} ${res.statusText}`)
        err.response = res
        err.status = res.status
        throw err
      }

      const user = await res.json()

      return new Response(JSON.stringify(user))
    } catch (err) {
      return new Response(err)
    }
  }
}
