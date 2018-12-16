'use strict'

import _ from 'lodash'

import { calculateStandardDeviation } from '../utils/stats'

class Asset {
  constructor (symbol, history, beta, expectedReturn) {
    const meanReturn = _.meanBy(history, 'changePercent')

    this.symbol = symbol
    this.history = history
    this.beta = beta
    this.expectedReturn = expectedReturn
    this.meanReturn = meanReturn
    this.standardDeviation = calculateStandardDeviation(history.map(quote => quote.changePercent), meanReturn)
  }

  toString () {
    return `${this.symbol} β: ${this.beta} ER: ${this.expectedReturn} σ: ${this.standardDeviation}`
  }
}

module.exports = Asset
