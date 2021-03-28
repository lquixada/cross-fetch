/** This is a more complex setup to test type resolutions */
import fetch, { Request, Response, Headers } from 'cross-fetch';

const headers = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json'
})

const customFetch = async (input: RequestInfo, init: RequestInit): Promise<void> => {
  const req = new Request(input)

  return fetch(req, init)
    .then((res: Response): Promise<any> => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then((user: any): Promise<Response> => {
      // Clone user just for the sake of using `new Response`
      const json = JSON.stringify(user);
      const res = new Response(json, { headers })

      return res.json()
    })
    .then((user: any): void => {
      console.log(user);
    })
    .catch((err: Error): void => {
      console.error(err);
    });
};

customFetch('https://api.github.com/users/lquixada', {
  method: 'GET',
  headers
})


