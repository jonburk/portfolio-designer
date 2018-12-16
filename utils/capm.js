'use strict'

import _ from 'lodash'

export function calculateExpectedReturn (riskFreeReturn, marketReturn, beta) {
  return riskFreeReturn + beta * (marketReturn - riskFreeReturn)
}

export function calculatePortfolioStandardDeviation (assets, covariances) {
  const map = {}
  assets.forEach(asset => {
    map[asset.symbol] = asset
  })

  console.log(covariances)

  return Math.sqrt(
    _.sum(assets.map(asset => Math.pow(asset.weight, 2) * asset.variance)) +
    _.sum(covariances.map(pair => {
      const a = map[pair.symbolA]
      const b = map[pair.symbolB]

      return 2 * a.weight * b.weight * pair.correlation * a.standardDeviation * b.standardDeviation
    })))
}
