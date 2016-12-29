import fetch from 'node-fetch';
import feathers from 'feathers/client';
import rest from '../../src/client';
import assert from 'assert';

const init = require('../../client');

describe('REST client tests', function () {
  it('is built correctly', () => {
    const transports = init();

    assert.equal(typeof init, 'function');
    assert.equal(typeof transports.jquery, 'function');
    assert.equal(typeof transports.request, 'function');
    assert.equal(typeof transports.superagent, 'function');
    assert.equal(typeof transports.fetch, 'function');
  });

  it('throw errors when no connection is provided', () => {
    const transports = init();

    try {
      transports.fetch();
    } catch (e) {
      assert.equal(e.message, 'fetch has to be provided to feathers-rest');
    }
  });

  it('app has the rest attribute', () => {
    const app = feathers();

    app.configure(rest('http://localhost:8889').fetch(fetch));

    assert.ok(app.rest);
  });

  it('throws an error when configured twice', () => {
    const app = feathers();

    app.configure(rest('http://localhost:8889').fetch(fetch));

    try {
      app.configure(rest('http://localhost:8889').fetch(fetch));
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Only one default client provider can be configured');
    }
  });

  it('errors when id property for get, patch, update or remove is undefined', () => {
    const app = feathers().configure(rest('http://localhost:8889')
      .fetch(fetch));

    const service = app.service('todos');

    return service.get().catch(error => {
      assert.equal(error.message, `id for 'get' can not be undefined`);

      return service.remove();
    }).catch(error => {
      assert.equal(error.message, `id for 'remove' can not be undefined, only 'null' when removing multiple entries`);

      return service.update(undefined, {});
    }).catch(error => {
      assert.equal(error.message, `id for 'update' can not be undefined, only 'null' when updating multiple entries`);

      return service.patch(undefined, {});
    }).catch(error => {
      assert.equal(error.message, `id for 'patch' can not be undefined, only 'null' when updating multiple entries`);
    });
  });
});
