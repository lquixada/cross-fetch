/// <reference path="./lib.fetch.d.ts" />

type Xfetch = typeof fetch
type XResponse = Response
type XRequest = Request
type XRequestInfo = RequestInfo
type XRequestInit = RequestInit
type XHeaders = Headers

export {
  Xfetch as fetch,
  XResponse as Response,
  XRequest as Request,
  XRequestInfo as RequestInfo,
  XRequestInit as RequestInit,
  XHeaders as Headers,
}

export default Xfetch
