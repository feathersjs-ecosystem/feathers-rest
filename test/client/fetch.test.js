import fetch from 'node-fetch';
import assert from 'assert';
import feathers from 'feathers/client';
import errors from 'feathers-errors';
import baseTests from 'feathers-commons/lib/test/client';

import server from './server';
import rest from '../../src/client';

describe('fetch REST connector', function () {
  const url = 'http://localhost:8889';
  const setup = rest(url).fetch(fetch);
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function (done) {
    this.server = server().listen(8889, done);
  });

  after(function (done) {
    this.server.close(done);
  });

  baseTests(service);

  it('supports custom headers', done => {
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

  it('handles errors properly', done => {
    service.get(-1, {}).catch(error => {
      assert.equal(error.code, 404);
      done();
    }).catch(done);
  });

  it('can initialize a client instance', done => {
    const init = rest(url).fetch(fetch);
    const todos = init.service('todos');

    assert.ok(todos instanceof init.Service, 'Returned service is a client');
    todos.find({}).then(todos => assert.deepEqual(todos, [
      {
        text: 'some todo',
        complete: false,
        id: 0
      }
    ])).then(() => done()).catch(done);
  });

  it('remove many', done => {
    service.remove(null).then(todo => {
      assert.equal(todo.id, null);
      assert.equal(todo.text, 'deleted many');
      done();
    }).catch(done);
  });

  it('converts feathers errors (#50)', done => {
    service.get(0, { query: { feathersError: true } }).catch(error => {
      assert.ok(error instanceof errors.NotAcceptable);
      assert.equal(error.message, 'This is a Feathers error');
      assert.equal(error.code, 406);
      assert.deepEqual(error.data, { data: true });
      assert.ok(error.response);
      done();
    }).catch(done);
  });

  it('returns null for 204 responses', done => {
    service.remove(0, { query: { noContent: true } }).then(response => {
      assert.strictEqual(response, null);
      done();
    }).catch(done);
  });
});
