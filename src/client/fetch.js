import Base from './base';

export default class Service extends Base {
  request(options) {
    let fetchOptions = Object.assign({}, options);

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    return new Promise((resolve, reject) => {
      this.connection(options.url, fetchOptions)
        .then(this.checkStatus)
        .then(this.parseJSON)
        .then(resolve).catch(reject);
    });
  }

  checkStatus(response) {
    if (response.ok) {
      return response;
    }
      
    let error = new Error(response.statusText);
    error.code = response.status;
    error.response = response;
    throw error;
  }

  parseJSON(response) {
    return response.json();
  }
}
