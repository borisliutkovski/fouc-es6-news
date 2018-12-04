export function thunkMiddleware(dispatch, getState) {
  function thunk(action) {
    if (typeof action === 'function') {
      return action(thunk, getState)
    } else {
      dispatch(action)
    }
  }

  return thunk
}

export function createLogger(logCbc) {
  return function (dispatch, getState) {
    return function (action) {
      if (typeof action === 'object') {
        logCbc(action)
      }
      dispatch(action)
    }
  }
}
