'use strict'

import _ from 'lodash'

import { calculateStandardDeviation } from '../utils/stats'

const TRADING_DAYS = 252

class Asset {
  constructor (symbol, history, beta, expectedReturn) {
    const meanReturn = _.meanBy(history, 'changePercent')
    const standardDeviation = calculateStandardDeviation(history.map(quote => quote.changePercent), meanReturn) * Math.sqrt(TRADING_DAYS)

    this.symbol = symbol
    this.history = history
    this.beta = beta
    this.expectedReturn = expectedReturn
    this.meanReturn = meanReturn
    this.standardDeviation = standardDeviation
    this.variance = Math.pow(standardDeviation, 2)
  }
}

module.exports = Asset
