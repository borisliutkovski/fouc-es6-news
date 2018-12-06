import { apiKey } from './config'
import { SuperCustomProxy } from './superCustomProxy';

class Dao {
  async getHeadlines() { }
  async getSources() { }
}

class HttpDao extends Dao {
  async getHeadlines(id) {
    const rand = Math.random()

    if (rand < 0.3) {
      throw new Error('RanDoM')
    }

    const res = await fetch('https://newsapi.org/v2/top-headlines' +
      '?language=en' +
      `${id != null ? `&sources=${id}` : ''}` +
      `&apiKey=${apiKey}`)
    const json = await res.json()
    return json
  }

  async getSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?language=en&apiKey=${apiKey}`)
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
    return [
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
      { name: 'asdfsadf' },
    ]
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
