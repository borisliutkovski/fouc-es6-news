import { connect } from '../redux/utils'
import getStore from '../foycStore'
import { hideModal } from '../actions/modal'

const store = getStore()
const dispatch = store.dispatch

const element = document.createElement('div')
element.className = 'modal-popup'

const render = ({ message, isShown }) => {
  element.innerHTML = isShown
    ? `
      <div class="header">MODAL WINDOW</div>
      <div class="content">
        <p>${message}</p>
        <button type="button">CLOSE</button>
      </div>
      `
    : ''

  isShown
    ? element.removeAttribute('hidden')
    : element.setAttribute('hidden', '')

  if (isShown) {
    const button = element.querySelector('button')
    button.onclick = () => dispatch(hideModal())
  }
}

connect(state => ({
  message: state.modal.message,
  isShown: state.modal.isShown
}), store)(render)

export default element
