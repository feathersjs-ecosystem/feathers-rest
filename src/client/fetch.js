import Base from './base';

export default class Service extends Base {
  request(options) {
    let fetchOptions = Object.assign({}, {
      method: options.method,
      headers: {
        'Accept': 'application/json'
      }
    }, options.fetch);

    return new Promise((resolve, reject) => {
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
        fetchOptions.headers['Content-Type'] = 'application/json';
      }

      this.connection(options.url, fetchOptions)
        .then(response => response.json())
        .then(resolve).catch(reject);
    });
  }
}
