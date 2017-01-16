interface HandlerResult extends Function{
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

interface Handler {
  (connection, options?) : () => HandlerResult;
}

interface Transport{
  jquery:     Handler;
  superagent: Handler;
  request:    Handler;
  fetch:      Handler;
}

declare function rest(base: string): Transport;

export = rest;
