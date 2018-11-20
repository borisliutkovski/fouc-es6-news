import 'babel-polyfill'
import Headline from './components/headline'
import SourceContainer from './components/source-container'
import { apiKey } from './config'

const render = () => {
  const setHeadlines = async ({ articles }) => {
    const headlineContainer = document.querySelector('.headline-container')
    headlineContainer.innerHTML = ''

    for (const article of articles.filter(({ title }) => !!title)) {
      const headlineEl = await Headline(article)
      headlineContainer.appendChild(headlineEl)
    }
  }

  const loadHeadlines = async id => {
    const res = await fetch('https://newsapi.org/v2/top-headlines' +
      '?language=en' +
      `${id != null ? `&sources=${id}` : ''}` +
      `&apiKey=${apiKey}`)
    const json = await res.json()
    setHeadlines(json)
  }

  const onSourceChange = source => {
    loadHeadlines(source && source.id)
  }

  const sc = new SourceContainer()
  sc.initialize()
  sc.onSourceChange = onSourceChange
  console.log(sc.initialSources)
  const header = document.querySelector('header')
  header.appendChild(sc.element)

  loadHeadlines()
}

if ('fetch' in window) {
  console.warn('has fetch')
  render()
} else {
  console.warn('import fetch')
  import('./polyfills').then(render)
}
