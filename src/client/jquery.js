import Base from './base';

export default class Service extends Base {
  request(options) {
    let opts = Object.assign({
      dataType: options.type || 'json'
    }, options);

    if(options.body) {
      opts.data = JSON.stringify(options.body);
      opts.contentType = 'application/json';
    }

    delete opts.type;
    delete opts.body;

    return new Promise((resolve, reject) => {
      this.connection.ajax(opts).then(resolve, xhr => {
        let error = xhr.responseText;

        try {
          error = JSON.parse(error);
        } catch(e) {}

        error.xhr = error.response = xhr;

        reject(error);
      });
    });
  }
}
