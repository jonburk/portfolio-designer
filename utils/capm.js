'use strict'

export function calculateExpectedReturn (riskFreeReturn, marketReturn, beta) {
  return riskFreeReturn + beta * (marketReturn - riskFreeReturn)
}
