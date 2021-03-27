/// <reference path="./lib.fetch.d.ts" />

type _fetch = typeof fetch
type _Response = Response
type _Request = Request
type _RequestInfo = RequestInfo
type _RequestInit = RequestInit
type _Headers = Headers

export {
  _fetch as fetch,
  _Response as Response,
  _Request as Request,
  _RequestInfo as RequestInfo,
  _RequestInit as RequestInit,
  _Headers as Headers,
}

export default _fetch
