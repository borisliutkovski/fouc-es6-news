import 'babel-polyfill'
import Headline from './components/headline'
import SourceComponent from './components/source'
import json from './some-config-or-whatever.json'
import ModalComponent from './components/modal'
import { loadHeadlines } from './actions/home'
import getStore from './foycStore'
import { connect } from './redux/utils'
require('./css/index.scss')

const init = () => {
  const store = getStore()
  const dispatch = store.dispatch

  const render = async ({ articles }) => {
    const setHeadlines = async () => {
      const headlineContainer = document.querySelector('.headline-container')
      headlineContainer.innerHTML = ''

      for (const article of articles.filter(({ title }) => !!title)) {
        const headlineEl = await Headline(article)
        headlineContainer.appendChild(headlineEl)
      }
    }

    setHeadlines()

    const sourceContainer = document.querySelector('.source-container')
    if (!sourceContainer.innerHTML) {
      sourceContainer.appendChild(SourceComponent)
    }

    const modalContainer = document.querySelector('.modal-container')
    if (!modalContainer.innerHTML) {
      modalContainer.append(ModalComponent)
    }
  }

  connect(state => ({
    articles: state.home.headlines
  }), store)(render)

  dispatch(loadHeadlines())
}

if ('fetch' in window) {
  console.warn('has fetch')
  init()
} else {
  console.warn('import fetch')
  import('./polyfills').then(init)
}
