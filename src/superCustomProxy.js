export class SuperCustomProxy {
  constructor(target, handler) {
    if (!handler.call) {
      return new Proxy(target, handler)
    }

    const { call, get, ...updHandler } = handler

    const methods = {};

    updHandler.get = function (target, prop) {
      if (typeof target[prop] !== 'function') {
        return get ? get(target, prop) : target[prop]
      }

      if (!methods[prop]) {
        methods[prop] = new Proxy(target[prop], {
          apply: function(target, thisarg, argslist) {
            return call(prop, target, thisarg, argslist)
          }
        })
      }

      return methods[prop]
    }

    return new Proxy(target, updHandler)
  }
}
