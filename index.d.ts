import {
  Headers,
  Request,
  RequestInfo,
  RequestInit,
  Response,
} from "./lib.fetch"

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
