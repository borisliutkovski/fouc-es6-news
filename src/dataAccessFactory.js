import { apiKey } from './config'
import { SuperCustomProxy } from './superCustomProxy'

class Dao {
  async getHeadlines() { }
  async getSources() { }
}

class HttpProvider {
  $requestParams

  constructor(requestParams) {
    this.$requestParams = requestParams || {}
  }

  get = (url, params) =>
    fetch(`${url}?${this.$getQuery(params)}`, { ...this.$requestParams })


  post = (url, body) =>
    fetch(url, { method: 'POST', body, ...this.$requestParams })


  put = (url, body) =>
    fetch(url, { method: 'PUT', body, ...this.$requestParams })


  delete = (url, params) =>
    fetch(`${url}?${this.$getQuery(params)}`, { method: 'DELETE', ...this.$requestParams })


  $getQuery = params =>
    Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
}

class FoycHttpDao extends Dao {

  $httpProvider
  constructor() {
    super()
    this.$httpProvider = new HttpProvider()
  }

  getHeadlines = async id => {
    const rand = Math.random()

    if (rand < 0.3) {
      throw new Error('RanDoM')
    }

    const res = await this.$httpProvider.get('https://newsapi.org/v2/top-headlines', {
      language: 'en',
      sources: id,
      apiKey
    })

    const json = await res.json()
    return json
  }

  getSources = async () => {
    const res = await this.$httpProvider.get('https://newsapi.org/v2/sources', {
      language: 'en',
      apiKey
    })

    const { sources } = await res.json()
    return sources
  }
}

class MockDao extends Dao {
  getHeadlines() {
    return Promise.resolve({
      articles: [
        { title: 'asdf', description: 'asdgdfh' },
        { title: 'asdf', description: 'asdgdfh' },
        { title: 'asdf', description: 'asdgdfh' },
        { title: 'asdf', description: 'asdgdfh' },
      ]
    })
  }

  getSources() {
    return Promise.resolve([
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
    ])
  }
}

const getDaoProxy = dao => {
  const handler = {
    call: function (methodName, target, thisArg, argumentsList) {
      console.log(methodName + ' request with arguments')
      console.log(argumentsList)

      return target(argumentsList)
    }
  }

  return new SuperCustomProxy(dao, handler)
}

class DaoFactory {
  create() { }
}

class HttpDaoFactory extends DaoFactory {
  create() {
    return getDaoProxy(new FoycHttpDao())
  }
}

class MockDaoFactory extends DaoFactory {
  create() {
    return getDaoProxy(new MockDao())
  }
}

let shouldReturnMock = false

/**
 * Should be called with true when running tests or whatever.
 */
export function setShouldMock(mock) {
  shouldReturnMock = !!mock
}

export default function () {
  if (shouldReturnMock) return new MockDaoFactory()
  return new HttpDaoFactory()
}
