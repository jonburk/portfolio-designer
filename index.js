'use strict'

import _ from 'lodash'
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
  { name: 'marketreturn', type: Number },
  { name: 'weightincrement', type: Number }
]

const options = commandLineArgs(optionDefinitions)

if (!options.symbols || options.symbols.length < 2) {
  console.log('Please enter two or more symbols.')
  process.exit()
}

// Option defaults
if (!options.riskfree) {
  options.riskfree = 0.03
}

if (!options.marketreturn) {
  options.marketreturn = 0.1
}

if (!options.weightincrement) {
  options.weightincrement = 0.5
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

    // Create all possible weights
    const weightCombinations = []
    createWeightDistributions(weightCombinations, 0, options.weightincrement, options.symbols.length)

    // Restrict to valid combinations
    _.remove(weightCombinations, weights => _.sum(weights) !== 1.0)
    console.log(weightCombinations)

    // Create a portfolio for each weight
    const portfolios = weightCombinations.map(weights => {
      const portfolio = new Portfolio(weights.map((weight, i) => new AssetWeight(assets[options.symbols[i]], weight)))
      portfolio.standardDeviation = calculatePortfolioStandardDeviation(portfolio.assets, covariances)
      portfolio.sharpeRatio = (portfolio.expectedReturn - options.riskfree) / portfolio.standardDeviation

      return portfolio
    })

    const optimalPortfolio = _.orderBy(portfolios, 'sharpeRatio', 'desc')[0]

    console.log(optimalPortfolio)
  })
  .catch(error => {
    console.log(error)
  })

function createWeightDistributions (weights, row, increment, count) {
  weights.push(_.fill(Array(count), 0))

  if (row > 0) {
    for (let col = 0; col < count; col++) {
      if (row % Math.pow(count, (count - 1) - col) === 0) {
        weights[row][col] = weights[row - 1][col] + increment
        break
      } else {
        weights[row][col] = weights[row - 1][col]
      }
    }
  }

  if (weights.length < Math.pow(1 / increment + 1, count)) {
    createWeightDistributions(weights, row + 1, increment, count)
  }
}
