import { TOGGLE_TOGGLE, START_LOAD_SOURCES, DONE_LOAD_SOURCES, CATEGORY_SELECT, SOURCE_SELECT } from '../actions/source'

const initialState = {
  isShown: false,
  isLoading: false,
  sources: [],
  categories: [],
  selectedCategory: null,
  selectedSource: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case START_LOAD_SOURCES: return {
      ...state,
      isLoading: true
    }
    case DONE_LOAD_SOURCES: return {
      ...state,
      isLoading: false,
      sources: action.payload,
      categories: [...new Set(action.payload.map(({ category }) => category))],
    }
    case TOGGLE_TOGGLE: return {
      ...state,
      isShown: !state.isShown
    }
    case CATEGORY_SELECT: return {
      ...state,
      selectedCategory: action.payload,
    }
    case SOURCE_SELECT: return {
      ...state,
      selectedSource: action.payload
    }
    default: return state
  }
}
