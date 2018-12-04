export function applyMiddleware(...middlewares) {
  return function (store) {
    for (const middleware of middlewares) {
      store.dispatch = middleware(store.dispatch, () => store.state)
    }

    return store
  }
}
