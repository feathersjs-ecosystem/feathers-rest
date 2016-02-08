import assert from 'assert';
import request from 'request';
import feathers from 'feathers/client';
import baseTests from 'feathers-commons/lib/test/client';

import server from './server';
import rest from '../../client';

describe('node-request REST connector', function() {
  const setup = rest('http://localhost:6777').request(request);
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function(done) {
    this.server = server().listen(6777, done);
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
