import Base from './base';

export default class Service extends Base {
  request(options) {
    let fetchOptions = Object.assign({}, options);

    fetchOptions.headers = Object.assign({
      Accept: 'application/json'
    }, fetchOptions.headers);

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

    return new Promise((resolve, reject) => {
      let body = response.body;
      let buffer = '';

      body.on('data', data => buffer += data.toString());
      body.on('error', reject);
      body.on('end', () => {
        let error = new Error(buffer);

        try {
          error = JSON.parse(buffer);
        } catch(e) {
          error.code = response.status;
        }

        error.response = response;

        reject(error);
      });
    });
  }

  parseJSON(response) {
    return response.json();
  }
}
