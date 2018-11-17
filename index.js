import Headline from './components/headline.js'
import SourceContainer from './components/source-container.js'
import { apiKey } from './config.js'

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
const header = document.querySelector('header')
header.appendChild(sc.element)



loadHeadlines()
