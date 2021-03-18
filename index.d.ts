import type {
  BodyInit,
  Headers as BaseHeaders,
  HeadersInit,
  Request,
  RequestInfo,
  RequestInit,
  Response,
  ResponseInit,
} from "./lib.fetch"
import type { Headers as IterHeaders } from "./lib.fetch.iterable";
type Headers = BaseHeaders & IterHeaders;

export const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export const Request: {
  prototype: Request;
  new(input: RequestInfo, init?: RequestInit): Request;
};

export const Response: {
  prototype: Response;
  new(body?: BodyInit | null, init?: ResponseInit): Response;
  error(): Response;
  redirect(url: string, status?: number): Response;
};

export const Headers: {
  prototype: Headers;
  new(init?: HeadersInit): Headers;
};

export default fetch;
