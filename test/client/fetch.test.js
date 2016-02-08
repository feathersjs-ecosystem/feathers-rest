import fetch from 'node-fetch';
import assert from'assert';
import feathers from 'feathers/client';
import baseTests from 'feathers-commons/lib/test/client';

import server from './server';
import rest from '../../client';

describe('fetch REST connector', function() {
  const setup = rest('http://localhost:8889').fetch(fetch);
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function(done) {
    this.server = server().listen(8889, done);
  });

  after(function(done) {
    this.server.close(done);
  });

  baseTests(service);

  it('supports custom headers', function(done){
    let headers = {
      'Authorization': 'let-me-in'
    };
    service.get(0, { headers }).then(todo => assert.deepEqual(todo, {
        id: 0,
        text: 'some todo',
        complete: false,
        query: {}
      })).then(done).catch(done);
  });
});
