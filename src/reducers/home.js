import { DONE_LOADING_HEADLINES, START_LOADING_HEADLINES } from '../actions/home'

const initialState = {
  headlines: [],
  isLoading: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case START_LOADING_HEADLINES: return {
      ...state,
      isLoading: true
    }
    case DONE_LOADING_HEADLINES: return {
      ...state,
      headlines: action.payload.articles,
      isLoading: false
    }
    default: return state
  }
}
