import { loadHeadlines } from './home'
import getDao from '../dataAccessFactory'

const dao = getDao()

export const TOGGLE_TOGGLE = 'TOGGLE_TOGGLE'
export const toggleToggle = () => ({ type: TOGGLE_TOGGLE })

export const START_LOAD_SOURCES = 'START_LOAD_SOURCES'
export const DONE_LOAD_SOURCES = 'DONE_LOAD_SOURCES'
export const loadSources = () => async dispatch => {
  dispatch({ type: START_LOAD_SOURCES })

  const sources = await dao.getSources()

  dispatch({ type: DONE_LOAD_SOURCES, payload: sources })
}

export const CATEGORY_SELECT = 'CATEGORY_SELECT'
export const selectCategory = category => ({
  type: CATEGORY_SELECT,
  payload: category
})

export const SOURCE_SELECT = 'SOURCE_SELECT'
export const selectSource = source => dispatch => {
  dispatch({type: SOURCE_SELECT, payload: source})
  dispatch(loadHeadlines(source && source.id))
}
