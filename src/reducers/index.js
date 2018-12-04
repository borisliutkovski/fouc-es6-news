import sourceContainer from './source'
import home from './home'
import modal from './modal'
import { combineReducers } from '../redux/utils'

export default combineReducers({
  sourceContainer,
  home,
  modal
})
