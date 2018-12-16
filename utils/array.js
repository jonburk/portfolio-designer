'use strict'

export function createPairs (array) {
  // Courtesy Stackoverflow
  // https://stackoverflow.com/a/53107778/27414
  return array.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0)
      .map((v, i2) => ([array[i1], array[i1 + 1 + i2]]))
  ], [])
}
