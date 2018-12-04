import rootReducer from './reducers'
import { createStore } from './redux/store'
import { applyMiddleware } from './redux/enhancers'
import { thunkMiddleware, createLogger } from './redux/middleware'

const foycStore = createStore(
  rootReducer,
  applyMiddleware(
    createLogger(console.log),
    thunkMiddleware,
  )
)

export default function() {
  return foycStore
}
