import superagent from 'superagent';
import feathers from 'feathers/client';
import baseTests from 'feathers-commons/lib/test/client';

import server from './server';
import rest from '../../client';

describe('Superagent REST connector', function() {
  const setup = rest('http://localhost:8889').superagent(superagent);
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function(done) {
    this.server = server().listen(8889, done);
  });

  after(function(done) {
    this.server.close(done);
  });

  baseTests(service);
});
