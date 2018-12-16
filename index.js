const _ = require('lodash')
const commandLineArgs = require('command-line-args')
const axios = require('axios')

const API_ROOT = 'https://api.iextrading.com/1.0'

const optionDefinitions = [
  { name: 'symbols', type: String, multiple: true, defaultOptions: true }
]

const options = commandLineArgs(optionDefinitions)

console.log(options)

// Get history for all symbols
const requests = _.map(options.symbols, symbol => {
  return axios.get(`${API_ROOT}/stock/${symbol}/chart/5y`)
    .then(result => {
      return {
        symbol: symbol,
        data: result.data
      }
    })
})

Promise.all(requests).then(results => {
  let data = {}

  // Shape the data
  results.forEach(result => {
    data[result.symbol] = {
      history: result.data
    }
  })

  // Calculate the covariance for all symbol pairs
  const pairs = createPairs(options.symbols)

  const covariances = _.map(pairs, pair => {
    return {
      pair: pair,
      covariance: calculateCovariance(pair, data)
    }
  })

  covariances.forEach(value => {
    console.log(`${value.pair[0]}, ${value.pair[1]}: ${value.covariance}`)
  })
}).catch(error => {
  console.log(error)
})

function createPairs (symbols) {
  return symbols.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(symbols.length - 1 - i1).fill(0)
      .map((v, i2) => ([symbols[i1], symbols[i1 + 1 + i2]]))
  ], [])
}

function calculateCovariance (pair, data) {
  const aValues = _.orderBy(data[pair[0]].history, 'date', 'desc')
  const bValues = _.orderBy(data[pair[1]].history, 'date', 'desc')
  const length = Math.min(aValues.length, bValues.length)

  const values = []

  for (let i = 0; i < length; i++) {
    values.push({
      a: aValues[i].changePercent,
      b: bValues[i].changePercent
    })
  }

  const aMean = _.meanBy(values, 'a')
  const bMean = _.meanBy(values, 'b')
  let numerator = 0

  values.forEach(value => {
    numerator += (value.a - aMean) * (value.b - bMean)
  })

  return numerator / (values.length - 1)
}
