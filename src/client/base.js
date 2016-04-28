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

    if (typeof id !== 'undefined' && id !== null) {
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
      method: 'GET',
      headers: Object.assign({}, params.headers)
    });
  }

  get(id, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      method: 'GET',
      headers: Object.assign({}, params.headers)
    });
  }

  create(body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query),
      body,
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, params.headers)
    });
  }

  update(id, body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      body,
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, params.headers)
    });
  }

  patch(id, body, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      body,
      method: 'PATCH',
      headers: Object.assign({ 'Content-Type': 'application/json' }, params.headers)
    });
  }

  remove(id, params = {}) {
    return this.request({
      url: this.makeUrl(params.query, id),
      method: 'DELETE',
      headers: Object.assign({}, params.headers)
    });
  }
}
