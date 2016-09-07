import Base from './base';

export default class Service extends Base {
  request(options) {
    let fetchOptions = Object.assign({}, options);

    fetchOptions.headers = Object.assign({
      Accept: 'application/json'
    }, this.options.headers, fetchOptions.headers);

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const fetch = this.connection;

    return fetch(options.url, fetchOptions)
        .then(this.checkStatus)
        .then(response => response.json());
  }

  checkStatus(response) {
    if (response.ok) {
      return response;
    }

    return response.json().then(error => {
      error.response = response;
      throw error;
    });
  }
}
