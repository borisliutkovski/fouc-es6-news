export function createStore(
  reducer,
  enhancer = s => s
) {
  let state = reducer({}, {})

  const callbacks = []

  const stateSub = (cbc) => {
    callbacks.push(cbc)
    cbc(state)

    return () => {
      callbacks.splice(callbacks.indexOf(cbc), 1)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    for (const cbc of callbacks) {
      cbc(state)
    }
  }

  const store = {
    stateSub,
    state,
    dispatch
  }

  return enhancer(store)
}
