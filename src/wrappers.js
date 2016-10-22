import makeDebug from 'debug';
import errors from 'feathers-errors';
import { hooks } from 'feathers-commons';

const debug = makeDebug('feathers:rest');
const hookObject = hooks.hookObject;
const statusCodes = {
  created: 201,
  noContent: 204,
  methodNotAllowed: 405
};
const methodMap = {
  find: 'GET',
  get: 'GET',
  create: 'POST',
  update: 'PUT',
  patch: 'PATCH',
  remove: 'DELETE'
};
const allowedMethods = function (service) {
  return Object.keys(methodMap)
    .filter(method => typeof service[method] === 'function')
    .map(method => methodMap[method])
    // Filter out duplicates
    .filter((value, index, list) => list.indexOf(value) === index);
};

// A function that returns the middleware for a given method and service
// `getArgs` is a function that should return additional leading service arguments
function getHandler (method, getArgs, service) {
  return function (req, res, next) {
    res.setHeader('Allow', allowedMethods(service).join(','));

    // Check if the method exists on the service at all. Send 405 (Method not allowed) if not
    if (typeof service[method] !== 'function') {
      debug(`Method '${method}' not allowed on '${req.url}'`);
      res.status(statusCodes.methodNotAllowed);
      return next(new errors.MethodNotAllowed(`Method \`${method}\` is not supported by this endpoint.`));
    }

    let params = Object.assign({}, req.params || {});
    delete params.__feathersId;

    // Grab the service parameters. Use req.feathers and set the query to req.query
    params = Object.assign({ query: req.query || {} }, params, req.feathers);

    // Run the getArgs callback, if available, for additional parameters
    const args = getArgs(req, res, next);

    // The service success callback which sets res.data or calls next() with the error
    const callback = function (error, data) {
      if (error) {
        debug(`Error in REST handler: \`${error.message || error}\``);
        return next(error);
      }

      res.data = data;
      res.hook = hookObject(method, 'after', args.concat([ params, callback ]));

      if (!data) {
        debug(`No content returned for '${req.url}'`);
        res.status(statusCodes.noContent);
      } else if (method === 'create') {
        res.status(statusCodes.created);
      }

      return next();
    };

    debug(`REST handler calling \`${method}\` from \`${req.url}\``);
    service[method].apply(service, args.concat([ params, callback ]));
  };
}

// Returns no leading parameters
function reqNone () {
  return [];
}

// Returns the leading parameters for a `get` or `remove` request (the id)
function reqId (req) {
  return [ req.params.__feathersId || null ];
}

// Returns the leading parameters for an `update` or `patch` request (id, data)
function reqUpdate (req) {
  return [ req.params.__feathersId || null, req.body ];
}

// Returns the leading parameters for a `create` request (data)
function reqCreate (req) {
  return [ req.body ];
}

// Returns wrapped middleware for a service method.
// Doing some fancy ES 5 .bind argument currying for .getHandler()
// Basically what you are getting for each is a function(service) {}
export default {
  find: getHandler.bind(null, 'find', reqNone),
  get: getHandler.bind(null, 'get', reqId),
  create: getHandler.bind(null, 'create', reqCreate),
  update: getHandler.bind(null, 'update', reqUpdate),
  patch: getHandler.bind(null, 'patch', reqUpdate),
  remove: getHandler.bind(null, 'remove', reqId)
};
