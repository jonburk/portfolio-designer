'use strict'

class AssetWeight {
  constructor (asset, weight) {
    this.symbol = asset.symbol
    this.standardDeviation = asset.standardDeviation
    this.variance = asset.variance
    this.weight = weight
    this.expectedReturn = asset.expectedReturn
  }
}

module.exports = AssetWeight
