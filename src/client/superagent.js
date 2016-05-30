import Base from './base';

export default class Service extends Base {
  request(options) {
    const superagent = this.connection(options.method, options.url)
      .set('Accept', 'application/json')
      .type(options.type || 'json');

    return new Promise((resolve, reject) => {
      superagent.set(options.headers);

      if(options.body) {
        superagent.send(options.body);
      }

      superagent.end(function(error, res) {
        if(error) {
          try {
            const response = error.response;
            error = JSON.parse(error.response.text);
            error.response = response;
          } catch(e) {}

          return reject(error);
        }

        resolve(res && res.body);
      });
    });
  }
}
