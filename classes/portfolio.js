'use strict'

import _ from 'lodash'

class Portfolio {
  constructor (assetWeights) {
    this.assets = assetWeights
    this.expectedReturn = _.sum(assetWeights.map(asset => asset.expectedReturn * asset.weight))
    this.standardDeviation = 0
    this.sharpeRatio = 0
  }
}

module.exports = Portfolio
