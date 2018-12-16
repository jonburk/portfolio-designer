'use strict'

import _ from 'lodash'

import { calculateStandardDeviation } from '../utils/stats'

class Asset {
  constructor (symbol, history, beta, expectedReturn) {
    const meanReturn = _.meanBy(history, 'changePercent')
    const standardDeviation = calculateStandardDeviation(history.map(quote => quote.changePercent), meanReturn)

    this.symbol = symbol
    this.history = history
    this.beta = beta
    this.expectedReturn = expectedReturn
    this.meanReturn = meanReturn
    this.standardDeviation = standardDeviation
    this.variance = standardDeviation ^ 2
  }
}

module.exports = Asset
