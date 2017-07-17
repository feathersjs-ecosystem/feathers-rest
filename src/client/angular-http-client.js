import Base from './base';

export default class Service extends Base {
  request (options) {
    const httpClient = this.connection;
    const HttpHeaders = this.options.HttpHeaders;

    if (!httpClient || !HttpHeaders) {
      throw new Error(`Please pass angular's 'httpClient' (instance) and and object with 'HttpHeaders' (class) to feathers-rest`);
    }

    const url = options.url;
    const requestOptions = {
      // method: options.method,
      body: options.body,
      headers: new HttpHeaders(
        Object.assign(
          {Accept: 'application/json'},
          this.options.headers,
          options.headers
        )
      )
    };

    return new Promise((resolve, reject) => {
      httpClient.request(options.method, url, requestOptions)
        .subscribe(resolve, reject);
    })
      .catch(error => {
        throw error.error || error;
      });
  }
}
