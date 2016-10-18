import assert from 'assert';
import feathers from 'feathers';
import jsdom from 'jsdom';
import baseTests from 'feathers-commons/lib/test/client';
import errors from 'feathers-errors';

import server from './server';
import rest from '../../src/client';

describe('jQuery REST connector', function() {
  const url = 'http://localhost:7676';
  const setup = rest(url).jquery({});
  const app = feathers().configure(setup);
  const service = app.service('todos');

  before(function(done) {
    this.server = server().listen(7676, function() {
      jsdom.env(
        '<html><body></body></html>',
        [ 'http://code.jquery.com/jquery-2.1.4.js' ],
        function (err, window) {
          window.jQuery.support.cors = true;
          service.connection = window.jQuery;
          done();
        }
      );
    });
  });

  after(function() {
    this.server.close();
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

  it('can initialize a client instance', done => {
    const init = rest(url).jquery(service.connection);
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
    });
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
});
