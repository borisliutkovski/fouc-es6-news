import getStore from '../foycStore'
import { toggleToggle, selectCategory, selectSource, loadSources } from '../actions/source'
import { connect } from '../redux/utils'

const Button = (className, textContent, onclick) => {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = className
  el.textContent = textContent
  el.onclick = onclick
  return el
}

const Category = ({ value, isActive }, onclick) =>
  Button(isActive ? 'active' : '', value, onclick)

const Source = ({ name, isActive }, onclick) =>
  Button('source' + (isActive ? ' active' : ''), name, onclick)

const Toggle = (onclick, initialState) => {
  const buttonEl = document.createElement('button')
  buttonEl.type = 'button'

  const setState = isActive => {
    buttonEl.textContent = (isActive ? 'Hide' : 'Show') + ' Outlets'
    buttonEl.className = 'toggle' + (isActive ? ' active' : '')
  }

  buttonEl.isActive = initialState
  setState(initialState)

  buttonEl.onclick = () => {
    buttonEl.isActive = !buttonEl.isActive
    setState(buttonEl.isActive)

    onclick(buttonEl.isActive)
  }

  return buttonEl
}

const store = getStore()
const dispatch = store.dispatch

const element = document.createElement('div')

const render = ({ isShown, sources, categories, selectedCategory, selectedSource }) => {
  element.innerHTML = `
    <div class="toggle-container"></div>
    <div class="categories" ${isShown ? '' : 'hidden'} ></div >
    <div class="sources" ${isShown ? '' : 'hidden'} ></div >
    `

  const toggleEl = element.querySelector('.toggle-container')

  toggleEl.appendChild(Toggle(shouldShow => {
    dispatch(toggleToggle())
  }, isShown))

  const categoriesEl = element.querySelector('.categories')

  categoriesEl.innerHTML = ''

  categories.forEach(category => categoriesEl.appendChild(
    Category({ value: category, isActive: selectedCategory === category }, () => {
      dispatch(selectCategory(category === selectCategory ? null : category))
    })))


  const sourcesEl = element.querySelector('.sources')
  sourcesEl.innerHTML = ''

  const filteredSources = selectedCategory
    ? sources.filter(s => s.category === selectedCategory)
    : sources

  for (const source of filteredSources) {
    sourcesEl.appendChild(
      Source(
        { ...source, isActive: source === selectedSource },
        () => dispatch(selectSource(source === selectedSource ? null : source))))
  }
}

dispatch(loadSources())

connect(state => ({
  isShown: state.sourceContainer.isShown,
  sources: state.sourceContainer.sources,
  categories: state.sourceContainer.categories,
  selectedCategory: state.sourceContainer.selectedCategory,
  selectedSource: state.sourceContainer.selectedSource
}), store)(render)

export default element
