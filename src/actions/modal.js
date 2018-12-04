export const SHOW_MODAL = 'SHOW_MODAL'
export const showModal = message => ({
  type: SHOW_MODAL,
  payload: message
})

export const HIDE_MODAL = 'HIDE_MODAL'
export const hideModal = () => ({
  type: HIDE_MODAL
})
