import 'babel-polyfill'
import Headline from './components/headline'
import SourceComponent from './components/source'
import { loadHeadlines } from './actions/home'
import getStore from './foycStore'
import { connect } from './redux/utils'
require('./css/index.scss')

const init = () => {
  const store = getStore()
  const dispatch = store.dispatch

  const render = async ({ articles, isModalShown }) => {
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

    if (isModalShown) {
      const modalContainer = document.querySelector('.modal-container')
      if (!modalContainer.innerHTML) {
        const modalModule = await import('./components/modal')
        modalContainer.append(modalModule.default)
      }
    }
  }

  connect(state => ({
    articles: state.home.headlines,
    isModalShown: state.modal.isShown
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
