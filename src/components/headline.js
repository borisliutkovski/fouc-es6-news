import '../css/headline.scss'

export default ({ title, description, source, content, url, urlToImage }, onload) => {
  const el = document.createElement('article')
  el.className = 'headline'

  el.innerHTML = `
    ${urlToImage ? `
      <figure>
        <a class="image-link" href="${url}">
          <img  />
        </a>
      </figure>`
      : ''}
    <div class="headline-text">
      <a class="title" href="${url}">${title}</a>
      <p class="headline-source">${source.name}</p>
      ${description ? `<p class="description">${description}</p>


      ${content ? `
        <div class="content">
          <br />
          <p class="content-text">${content}</p>
        </div>
        <button type="button" class="content-toggle">Show more</button>
      ` : ''}
      ` : ''}

    </div>
  `

  if (content && description) {
    const toggle = el.querySelector('.content-toggle')
    const content = el.querySelector('.content')

    const setState = isHidden => {
      content.style.display = isHidden ? 'none' : 'block'
      toggle.textContent = isHidden ? 'Show more' : 'Show less'
    }

    content.isHidden = true
    setState(true)

    toggle.addEventListener('click', () => {
      content.isHidden = !content.isHidden
      setState(content.isHidden)
    })
  }

  return new Promise(res => {
    if (urlToImage) {
      const img = el.querySelector('img')

      img.onload = () => res(el)
      img.onerror = () => {
        img.setAttribute('hidden', '')
        res(el)
      }
      img.src = urlToImage
    } else {
      res(el)
    }
  })
}
