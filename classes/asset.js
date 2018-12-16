'use strict'

import _ from 'lodash'

import { calculateStandardDeviation } from '../utils/stats'

class Asset {
  constructor (symbol, history) {
    const meanReturn = _.meanBy(history, 'changePercent')

    this.symbol = symbol
    this.history = history
    this.beta = 0
    this.meanReturn = meanReturn
    this.expectedReturn = 0
    this.standardDeviation = calculateStandardDeviation(history.map(quote => quote.changePercent), meanReturn)
  }
}

module.exports = Asset
