function removeNumericKeys(obj) {
  let filteredObj = {}

  for (const key in obj) {
    if (typeof obj[key] === 'object')
      removeNumericKeys(obj[key])

    if (!isNaN(key) && !Array.isArray(obj)) {
      delete obj[key]
    }
  }
}

module.exports = function (source) {
  this.cacheable()

  var json = JSON.parse(source)

  if (typeof json === 'object')
    removeNumericKeys(json)

  this.callback(null, JSON.stringify(json))
}
