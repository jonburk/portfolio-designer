'use strict'

import { calculateCovariance, calculateCorrelation } from '../utils/stats'

class CovariancePair {
  constructor (a, b) {
    const covariance = calculateCovariance(a, b)

    this.symbolA = a.symbol
    this.symbolB = b.symbol
    this.covariance = covariance
    this.correlation = calculateCorrelation(a.standardDeviation, b.standardDeviation, covariance)
  }
}

module.exports = CovariancePair
