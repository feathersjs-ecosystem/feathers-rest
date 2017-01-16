declare function rest(handler:Function): Function;

declare namespace rest{
  export function formatter(req:any, res:any, next:Function): void;
}

export = rest;
