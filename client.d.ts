

interface handlerResult extends Function{
  /**
   * initialize service
   */
  () : void;
  /**
   * Transport Service
   */
  Service:any;

  /**
   * default Service
   */
  service:any;
}

interface handler {
  (connection, options = {}) : () => handlerResult;
}

interface tranport{
  jquery:     handler;
  superagent: handler;
  request:    handler;
  fetch:      handler;
}

export default function(base: string): transport;
