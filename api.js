'use strict'

import axios from 'axios'
import Asset from './classes/asset'
import Quote from './classes/quote'

const API_ROOT = 'https://api.iextrading.com/1.0'

export function getQuotes (symbols) {
  return symbols.map(symbol => {
    return axios.get(`${API_ROOT}/stock/${symbol}/chart/5y`)
      .then(result => {
        const history = result.data.map(value => new Quote(value.date, value.changePercent))

        return new Asset(symbol, history)
      })
  })
}
