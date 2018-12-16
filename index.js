'use strict'

import commandLineArgs from 'command-line-args'

import CovariancePair from './classes/covariance-pair'

import { createPairs } from './utils/array'
import { getAssets } from './api'

const optionDefinitions = [
  { name: 'symbols', type: String, multiple: true, defaultOptions: true },
  { name: 'riskfree', type: Number },
  { name: 'marketreturn', type: Number }
]

const options = commandLineArgs(optionDefinitions)

// Defaults for risk free and market returns
if (!options.riskfree) {
  options.riskfree = 0.03
}

if (!options.marketreturn) {
  options.marketreturn = 0.1
}

// Get history for all symbols
const quotes = getAssets(options.symbols, options.riskfree, options.marketreturn)

Promise.all(quotes).then(results => {
  console.log(results.map(result => result.toString()))
  const assets = {}

  results.forEach(asset => {
    assets[asset.symbol] = asset
  })

  // Calculate the covariance for all symbol pairs
  const pairs = createPairs(options.symbols)
  const covariances = pairs.map(pair => new CovariancePair(assets[pair[0]], assets[pair[1]]))

  covariances.forEach(value => {
    console.log(`${value.symbolA}, ${value.symbolB}: ${value.covariance}`)
  })
}).catch(error => {
  console.log(error)
})
