/// <reference no-default-lib="true"/>
/// <reference path="./lib.fetch.d.ts" />

declare function _fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

declare var _Request: {
  prototype: Request;
  new(input: RequestInfo, init?: RequestInit): Request;
};

declare var _Response: {
  prototype: Response;
  new(body?: BodyInit | null, init?: ResponseInit): Response;
  error(): Response;
  redirect(url: string, status?: number): Response;
};

declare var _Headers: {
  prototype: Headers;
  new(init?: HeadersInit): Headers;
};

type _RequestInfo = RequestInfo
type _RequestInit = RequestInit

export {
  _fetch as fetch,
  _Response as Response,
  _Request as Request,
  _RequestInfo as RequestInfo,
  _RequestInit as RequestInit,
  _Headers as Headers,
}

export default _fetch
