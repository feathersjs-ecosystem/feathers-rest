import jsdom from 'jsdom';
import feathers from 'feathers';
import baseTests from 'feathers-commons/lib/test/client';

import server from './server';
import rest from '../../client';

describe('jQuery REST connector', function() {
  const setup = rest('http://localhost:7676').jquery({});
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function(done) {
    this.server = server().listen(7676, function() {
      jsdom.env({
        html: '<html><body></body></html>',
        scripts: [
          'http://code.jquery.com/jquery-2.1.4.js'
        ],
        done: function (err, window) {
          window.jQuery.support.cors = true;
          service.connection = window.jQuery;
          done();
        }
      });
    });
  });

  after(function() {
    this.server.close();
  });

  baseTests(service);
});
