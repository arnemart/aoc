import { $, intdiv, ints, length, map, readInput, shift, split, sum, zipWith } from '../../common'

const digits = $(readInput(), split(), ints)

console.log(
  'Part 1:',
  $(
    digits,
    zipWith($(digits, shift(1))),
    map(([a, b]) => (a == b ? a : 0)),
    sum
  )
)

console.log(
  'Part 1:',
  $(
    digits,
    zipWith($(digits, shift($(digits, length, intdiv(2))))),
    map(([a, b]) => (a == b ? a : 0)),
    sum
  )
)
