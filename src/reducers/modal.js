import { SHOW_MODAL, HIDE_MODAL } from '../actions/modal'

const initialState = {
  isShown: false,
  message: null
}

export default function (state = initialState, action) {
  switch(action.type) {
    case SHOW_MODAL: return {
      ...state,
      isShown: true,
      message: action.payload
    }
    case HIDE_MODAL: return {
      ...state,
      isShown: false,
      message: null
    }
    default: return state
  }
}
