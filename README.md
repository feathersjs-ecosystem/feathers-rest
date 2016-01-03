# feathers-rest

[![Build Status](https://travis-ci.org/feathersjs/feathers-rest.png?branch=master)](https://travis-ci.org/feathersjs/feathers-rest)

> The Feathers REST API provider

## About

This provider exposes [Feathers](http://feathersjs.com) services through a RESTful API using [Express](http://expressjs.com). It can be used with Feathers 1.x and 2.x.

__Note:__ For the full API documentation go to [feathersjs.com/docs/providers.md](http://feathersjs.com/docs/providers.md).

## Quick example

```js
import feathers from 'feathers';
import bodyParser from 'body-parser';
import rest from 'feathers-rest';

const app = feathers()
  .configure(rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(function(req, res, next) {
    req.feathers.data = 'Hello world';
    next();
  });

app.use('/:app/todos', {
  get: function(id, params) {
    console.log(params.data); // -> 'Hello world'
    console.log(params.app); // will be `my` for GET /my/todos/dishes

    return Promise.resolve({
      id,
      params,
      description: `You have to do ${name}!`
    });
  }
});
```

## Changelog

__1.0.0__

- Initial release of extracted module from Feathers 1.3

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
