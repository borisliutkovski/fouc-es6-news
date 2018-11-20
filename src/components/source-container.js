import { apiKey } from '../config'

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

const Toggle = (onclick, initialState = false) => {
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

const categories = Symbol()
const sourcesSym = Symbol()
const loadSources = Symbol()
const initToggle = Symbol()
const toggleContent = Symbol()
const onSourceClick = Symbol()
const onCategoryClick = Symbol()

export default class SourceContainer {
  #_categories = []
  #categoriesEl
  #sourcesEl
  #initialSources = []
  #_sources = []
  #selectedCategory
  #selectedSource

  constructor() {
    this.element = document.createElement('div')
    this.element.innerHTML = `
      <div class="toggle-container"></div>
      <div class="categories"></div>
      <div class="sources"></div>
    `
    this.categoriesEl = this.element.querySelector('.categories')
    this.sourcesEl = this.element.querySelector('.sources')

    this.element.className = 'source-container'
    this.onSourceChange = () => { }

    this[initToggle]()
  }

  async initialize() {
    await this[loadSources]()
  }

  async [loadSources]() {
    const res = await fetch(`https://newsapi.org/v2/sources?language=en&apiKey=${apiKey}`)
    const { sources } = await res.json()
    this[sourcesSym] = sources
    this.initialSources = sources
    this[categories] = []
  }

  set [categories](newCategories = []) {
    if (!newCategories?.length) {
      newCategories = [...new Set(this.initialSources.map(({ category }) => category))]
    }

    this.categoriesEl.innerHTML = ''

    this._categories = newCategories
    this._categories.forEach(category => this.categoriesEl.appendChild(
      Category({ value: category, isActive: this.selectedCategory === category }, () => this[onCategoryClick](category))))
  }

  get [categories]() {
    return this._categories
  }

  [onCategoryClick](newCategory) {
    this.selectedCategory = this.selectedCategory === newCategory
      ? undefined
      : newCategory

    this[categories] = this[categories]

    this[sourcesSym] = this.selectedCategory
      ? this.initialSources.filter(({ category }) => category === newCategory)
      : this.initialSources
  }

  set [sourcesSym](newSources = []) {
    this._sources = newSources

    this.sourcesEl.innerHTML = ''

    for (const source of newSources) {
      this.sourcesEl.appendChild(
        Source(
          { ...source, isActive: source === this.selectedSource },
          () => this[onSourceClick](source)))
    }
  }

  get [sourcesSym]() {
    return this._sources
  }

  [onSourceClick](source) {
    this.selectedSource = this.selectedSource === source
      ? undefined
      : source

    this[sourcesSym] = this._sources
    this.onSourceChange(this.selectedSource)
  }

  [initToggle]() {
    const toggleContainer = this.element.querySelector('.toggle-container')
    toggleContainer.appendChild(Toggle(shouldShow => {
      this[toggleContent](shouldShow)
    }, false))
    this[toggleContent](false)
  }

  [toggleContent](isShown) {
    if (isShown) {
      this.categoriesEl.removeAttribute('hidden')
      this.sourcesEl.removeAttribute('hidden')
    } else {
      this.categoriesEl.setAttribute('hidden', '')
      this.sourcesEl.setAttribute('hidden', '')
    }
  }
}
