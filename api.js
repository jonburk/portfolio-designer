'use strict'

import axios from 'axios'

import Asset from './classes/asset'
import Quote from './classes/quote'

import { calculateExpectedReturn } from './utils/capm'

const API_ROOT = 'https://api.iextrading.com/1.0'

export function getAssets (symbols, riskFreeReturn, marketReturn) {
  return symbols.map(symbol => {
    let history = null

    return getHistory(symbol)
      .then(result => {
        history = result.data.map(value => new Quote(value.date, value.changePercent))
        return getStats(symbol)
      })
      .then(result => {
        const beta = result.data.beta
        const expectedReturn = calculateExpectedReturn(riskFreeReturn, marketReturn, beta)
        return new Asset(symbol, history, beta, expectedReturn)
      })
  })
}

function getStats (symbol) {
  return axios.get(`${API_ROOT}/stock/${symbol}/stats`)
}

function getHistory (symbol) {
  return axios.get(`${API_ROOT}/stock/${symbol}/chart/5y`)
}
