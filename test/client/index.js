import assert from 'assert';

describe('REST client tests', function() {
  it('is built correctly', () => {
    const init = require('../../client');
    const transports = init();

    assert.equal(typeof init, 'function');
    assert.equal(typeof transports.jquery, 'function');
    assert.equal(typeof transports.request, 'function');
    assert.equal(typeof transports.superagent, 'function');
    assert.equal(typeof transports.fetch, 'function');
  });

  it('throw errors when no connection is provided', () => {
    const init = require('../../client');
    const transports = init();

    try {
      transports.fetch();
    } catch(e) {
      assert.equal(e.message, 'fetch has to be provided to feathers-rest');
    }
  });
});
