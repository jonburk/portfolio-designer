'use strict'

import _ from 'lodash'

export function calculateStandardDeviation (values, mean) {
  return Math.sqrt(_.mean(values.map(value => (value - mean) ^ 2)))
}

export function calculateCovariance (a, b) {
  const aValues = _.orderBy(a.history, 'date', 'desc')
  const bValues = _.orderBy(b.history, 'date', 'desc')
  const length = Math.min(aValues.length, bValues.length)

  const values = []

  for (let i = 0; i < length; i++) {
    if (aValues[i].date !== bValues[i].date) {
      throw new Error(`Stock price history dates do not align for ${a.symbol} and ${b.symbol}. Unable to calculate covariance.`)
    }

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
