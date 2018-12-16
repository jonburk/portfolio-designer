'use strict'

import commandLineArgs from 'command-line-args'

import CovariancePair from './classes/covariance-pair'

import { createPairs } from './utils/array'
import { getQuotes } from './api'

const optionDefinitions = [
  { name: 'symbols', type: String, multiple: true, defaultOptions: true },
  { name: 'riskfree', type: Number },
  { name: 'marketreturn', type: Number }
]

const options = commandLineArgs(optionDefinitions)

// Get history for all symbols
const quotes = getQuotes(options.symbols)

Promise.all(quotes).then(results => {
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
