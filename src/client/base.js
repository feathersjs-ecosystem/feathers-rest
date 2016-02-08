import query from 'qs';
import { stripSlashes } from 'feathers-commons';

export default class Base {
  constructor(settings) {
    this.name = stripSlashes(settings.name);
    this.options = settings.options;
    this.connection = settings.connection;
    this.base = `${settings.base}/${this.name}`;
  }

  makeUrl(params, id) {
    params = params || {};
    let url = this.base;

    if (typeof id !== 'undefined') {
      url += `/${id}`;
    }

    if(Object.keys(params).length !== 0) {
      const queryString = query.stringify(params);

      url += `?${queryString}`;
    }

    return url;
  }

  find(params = {}) {
    return this.request({
      url: this.makeUrl(params.query),
      method: 'GET'
    });
  }

  get(id, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      method: 'GET'
    });
  }

  create(body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query),
      body,
      method: 'POST'
    });
  }

  update(id, body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      body,
      method: 'PUT'
    });
  }

  patch(id, body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      body,
      method: 'PATCH'
    });
  }

  remove(id, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      method: 'DELETE'
    });
  }
}
