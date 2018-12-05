import getDao from '../dataAccessFactory'
import { showModal } from './modal'

const dao = getDao()

export const START_LOADING_HEADLINES = 'START_LOADING_HEADLINES'
export const DONE_LOADING_HEADLINES = 'DONE_LOADING_HEADLINES'
export const loadHeadlines = id => async dispatch => {
  dispatch({ type: START_LOADING_HEADLINES })

  let headlines
  try {
    headlines = await dao.getHeadlines(id)
  } catch (e) {
    dispatch(showModal('Request error'))
    headlines = { articles: [] }
  }

  dispatch({ type: DONE_LOADING_HEADLINES, payload: headlines })
}
