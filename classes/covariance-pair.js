'use strict'

import { calculateCovariance } from '../utils/stats'

class CovariancePair {
  constructor (a, b) {
    this.symbolA = a.symbol
    this.symbolB = b.symbol
    this.covariance = calculateCovariance(a, b)
  }
}

module.exports = CovariancePair
