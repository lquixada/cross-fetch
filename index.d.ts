/// <reference lib="dom" />

declare module "cross-fetch" {
  export const fetch: typeof global.fetch;
  export const Request: typeof global.Request;
  export const Response: typeof global.Response;
  export const Headers: typeof global.Headers;
  export default fetch;
}
