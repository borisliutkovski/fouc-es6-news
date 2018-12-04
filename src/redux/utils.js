export function combineReducers(
  reducerMap
) {
  return function (state, action) {
    for (let key in reducerMap) {
      state[key] = reducerMap[key](state[key], action)
    }

    return state
  }
}

export function connect(mapStateToProps, store) {
  const { stateSub } = store

  let prevProps = {}

  return function (render) {
    function reRender(state) {
      const mappedProps = mapStateToProps(state)

      for (let prop in mappedProps) {
        if (prevProps[prop] !== mappedProps[prop]) {
          prevProps = mappedProps
          render(mappedProps)
          return
        }
      }
    }

    stateSub(reRender)
  }
}
