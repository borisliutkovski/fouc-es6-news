import getDao from '../dataAccessFactory'

const dao = getDao()

export const START_LOADING_HEADLINES = 'START_LOADING_HEADLINES'
export const DONE_LOADING_HEADLINES = 'DONE_LOADING_HEADLINES'
export const loadHeadlines = id => async dispatch => {
  dispatch({type: START_LOADING_HEADLINES})

  const headlines = await dao.getHeadlines(id)

  dispatch({type: DONE_LOADING_HEADLINES, payload: headlines })
}
