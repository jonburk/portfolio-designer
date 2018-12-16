'use strict'

class Portfolio {
  constructor (assetWeights) {
    this.assets = assetWeights
    this.expectedReturn = 0
    this.standardDeviation = 0
    this.sharpeRatio = 0
  }
}

module.exports = Portfolio
