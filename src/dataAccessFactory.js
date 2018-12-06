import { apiKey } from './config'
import { SuperCustomProxy } from './superCustomProxy'

class Dao {
  async getHeadlines() { }
  async getSources() { }
}

class HttpDao extends Dao {
  $requestParams

  constructor(requestParams) {
    super()
    this.$requestParams = requestParams || {}
  }

  $get(url, params) {
    return fetch(`${url}?${this.$getQuery(params)}`, { ...this.$requestParams })
  }

  $post(url, body) {
    return fetch(url, { method: 'POST', body, ...this.$requestParams })
  }

  $put(url, body) {
    return fetch(url, { method: 'PUT', body, ...this.$requestParams })
  }

  $delete(url, params) {
    return fetch(`${url}?${this.$getQuery(params)}`, { method: 'DELETE', ...this.$requestParams })
  }

  $getQuery(params) {
    return Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
  }

  getHeadlines = async id => {
    const rand = Math.random()

    if (rand < 0.3) {
      throw new Error('RanDoM')
    }

    const res = await this.$get('https://newsapi.org/v2/top-headlines', {
      language: 'en',
      sources: id,
      apiKey
    })

    const json = await res.json()
    return json
  }

  async getSources() {
    const res = await this.$get('https://newsapi.org/v2/top-headlines', {
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
    return getDaoProxy(new HttpDao())
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

export default function() {
  if (shouldReturnMock) return new MockDaoFactory()
  return new HttpDaoFactory()
}
