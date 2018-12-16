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
  { name: 'weightincrement', type: Number },
  { name: 'maxweight', type: Number }
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
  options.weightincrement = 0.05
}

if (!options.maxweight) {
  options.maxweight = 1
}

// Get history for all symbols
const quotes = getAssets(options.symbols, options.riskfree, options.marketreturn)

Promise.all(quotes)
  .then(results => {
    const assets = {}

    results.forEach(asset => {
      assets[asset.symbol] = asset
    })

    // Calculate the covariance for all symbol pairs
    const pairs = createPairs(options.symbols)
    const covariances = pairs.map(pair => new CovariancePair(assets[pair[0]], assets[pair[1]]))

    // Create all possible weights
    const weightCombinations = createWeightDistributions(options.weightincrement, options.symbols.length, options.maxweight)

    console.log('')
    console.log(`Analyzing ${weightCombinations.length} portfolio combinations...`)

    // Create a portfolio for each weight
    const portfolios = weightCombinations.map(weights => {
      const portfolio = new Portfolio(weights.map((weight, i) => new AssetWeight(assets[options.symbols[i]], weight)))
      portfolio.standardDeviation = calculatePortfolioStandardDeviation(portfolio.assets, covariances)
      portfolio.sharpeRatio = (portfolio.expectedReturn - options.riskfree) / portfolio.standardDeviation

      return portfolio
    })

    const optimalPortfolio = _.orderBy(portfolios, 'sharpeRatio', 'desc')[0]
    console.log('')
    console.log('Maximum Sharpe Ratio')
    console.log('============================================================================================')
    console.log('')

    optimalPortfolio.assets.forEach(asset => {
      console.log(`${asset.symbol}: ${asset.weight * 100}%`)
    })

    console.log(`Expected Return: ${Math.round(optimalPortfolio.expectedReturn * 10000) / 100}%`)
    console.log(`Standard Deviation: ${Math.round(optimalPortfolio.standardDeviation * 10000) / 100}%`)
    console.log(`Sharpe Ratio: ${Math.round(optimalPortfolio.sharpeRatio * 100) / 100}`)

    console.log('')
    console.log('============================================================================================')
  })
  .catch(error => {
    console.log(error)
  })

function createWeightDistributions (increment, count, maxWeight) {
  const percentages = 1 / increment + 1
  const maxRows = Math.pow(percentages, count)
  const weights = []
  let previousRow = _.fill(Array(count), 0)

  for (let row = 0; row < maxRows; row++) {
    const currentRow = _.fill(Array(count), 0)

    if (row > 0) {
      for (let col = 0; col < count; col++) {
        if (row % Math.pow(percentages, (count - 1) - col) === 0) {
          currentRow[col] = Math.round((previousRow[col] + increment) * 100) / 100
          break
        } else {
          currentRow[col] = previousRow[col]
        }
      }
    }

    previousRow = currentRow

    if (_.sum(currentRow) === 1 && !_.find(currentRow, weight => weight > maxWeight)) {
      weights.push(currentRow)
    }
  }

  return weights
}
