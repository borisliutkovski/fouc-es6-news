const btn = document.querySelector('button.load-btn')

btn.addEventListener('click', () => {
  require('./index.js')
  var style = require('./css/index.scss')
  console.log(style)
})
