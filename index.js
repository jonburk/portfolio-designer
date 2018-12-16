'use strict'

import commandLineArgs from 'command-line-args'

import CovariancePair from './classes/covariance-pair'
import AssetWeight from './classes/asset-weight'
import Portfolio from './classes/portfolio'

import { createPairs } from './utils/array'
import { getAssets } from './api'
import { calculatePortfolioStandardDeviation } from './utils/capm'

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

Promise.all(quotes)
  .then(results => {
    console.log(results.map(result => `${result.symbol} β: ${result.beta} ER: ${result.expectedReturn} σ: ${result.standardDeviation}`))
    const assets = {}

    results.forEach(asset => {
      assets[asset.symbol] = asset
    })

    // Calculate the covariance for all symbol pairs
    const pairs = createPairs(options.symbols)
    const covariances = pairs.map(pair => new CovariancePair(assets[pair[0]], assets[pair[1]]))

    covariances.forEach(value => {
      console.log(`${value.symbolA}, ${value.symbolB}: cov: ${value.covariance} ρ = ${value.correlation}`)
    })

    // Create portfolio with equal weights
    const portfolio = new Portfolio(options.symbols.map((symbol, i) => new AssetWeight(assets[symbol], 1 / options.symbols.length)))
    portfolio.standardDeviation = calculatePortfolioStandardDeviation(portfolio.assets, covariances)
    portfolio.sharpeRatio = (portfolio.expectedReturn - options.riskfree) / portfolio.standardDeviation

    console.log(portfolio)
  })
  .catch(error => {
    console.log(error)
  })
