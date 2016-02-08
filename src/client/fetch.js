import Base from './base';

export default class Service extends Base {
  request(options) {
    let fetchOptions = Object.assign({}, options);

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    return new Promise((resolve, reject) => {
      this.connection(options.url, fetchOptions)
        .then(response => response.json())
        .then(resolve).catch(reject);
    });
  }
}
