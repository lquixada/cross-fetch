module.exports = global.fetch // To enable: import fetch from 'cross-fetch'
module.exports.default = global.fetch // For TypeScript consumers without esModuleInterop.
module.exports.fetch = global.fetch // To enable: import {fetch} from 'cross-fetch'
module.exports.Headers = global.Headers
module.exports.Request = global.Request
module.exports.Response = global.Response

// from: https://github.com/facebook/react-native/issues/21209#issuecomment-495294672

FileReader.prototype.readAsArrayBuffer = function (blob) {
  if (this.readyState === this.LOADING) throw new Error('InvalidStateError')
  this._setReadyState(this.LOADING)
  this._result = null
  this._error = null
  const fr = new FileReader()
  fr.onloadend = () => {
    const content = atob(fr.result.substr('data:application/octet-stream;base64,'.length))
    const buffer = new ArrayBuffer(content.length)
    const view = new Uint8Array(buffer)
    view.set(Array.from(content).map(c => c.charCodeAt(0)))
    this._result = buffer
    this._setReadyState(this.DONE)
  }
  fr.readAsDataURL(blob)
}

// from: https://stackoverflow.com/questions/42829838/react-native-atob-btoa-not-working-without-remote-js-debugging
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const atob = (input = '') => {
  const str = input.replace(/=+$/, '')
  let output = ''

  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.")
  }
  for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++)); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer)
  }

  return output
}
