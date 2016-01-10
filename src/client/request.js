import Base from './base';

export default class Service extends Base {
  request(options) {
    return new Promise((resolve, reject) => {
      this.connection(Object.assign({
        json: true
      }, options), function(error, res, data) {
        if(error) {
          return reject(error);
        }

        if(!error && res.statusCode >= 400) {
          return reject(new Error(data));
        }

        resolve(data);
      });
    });
  }
}
