/// <reference path="./lib.fetch.d.ts" />

type Xfetch = typeof fetch
type XResponse = Response
type XRequest = Request
type XHeaders = Headers

export {
  Xfetch as fetch,
  XResponse as Response,
  XRequest as Request,
  XHeaders as Headers,
}

export default Xfetch
