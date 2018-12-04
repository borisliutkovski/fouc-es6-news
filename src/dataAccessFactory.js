import { apiKey } from './config'
import { showModal } from './actions/modal'
// import getStore from './foycStore'

class DataAccess {
  async getHeadlines(id) {
    const rand = Math.random()

    if (rand < 0.3) {
      // throw new Error('RanDoM')
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

const dao = new DataAccess()

const daoMethodProxies = {}

// const { dispatch } = getStore()

const proxyHandler = {
  get: function (target, prop) {
    if (!daoMethodProxies[prop]) {
      daoMethodProxies[prop] = new Proxy(target[prop], {
        apply: function (target, thisArg, argumentsList) {
          console.log(prop + ' request with arguments')
          console.log(argumentsList)

          try {
            return target(argumentsList)
          } catch (e) {
            // dispatch(showModal('Request failed'))
          }

        }
      })
    }

    return daoMethodProxies[prop]
  }
}

const dataAccessProxy = new Proxy(dao, proxyHandler)

export default function () {
  return dataAccessProxy
}
