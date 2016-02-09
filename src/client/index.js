import jQuery from './jquery';
import Superagent from './superagent';
import Request from './request';
import Fetch from './fetch';

const transports = {
  jquery: jQuery,
  superagent: Superagent,
  request: Request,
  fetch: Fetch
};

export default function(base = '') {
  const result = {};

  Object.keys(transports).forEach(key => {
    const Service = transports[key];

    result[key] = function(connection, options = {}) {
      if(!connection) {
        throw new Error(`${key} has to be provided to feathers-rest`);
      }

      return function() {
        this.rest = connection;
        this.defaultService = function(name) {
          return new Service({ base, name, connection, options });
        };
      };
    };
  });

  return result;
}
