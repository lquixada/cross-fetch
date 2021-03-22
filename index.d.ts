import * as libFetch from "./lib.fetch";

export const fetch: typeof libFetch.fetch;
export const Request: typeof libFetch.Request;
export const Response: typeof libFetch.Response;
export const Headers: typeof libFetch.Headers;
export default fetch;
