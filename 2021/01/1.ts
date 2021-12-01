import { $, filter, ints, length, lines, map, readInput, slice, sum, zipWith } from '../../common'

const input = $(readInput(), lines, ints)

const countIncreasing = (input: number[]) =>
  $(
    input,
    zipWith($(input, slice(1))),
    filter(([a, b]) => b > a),
    length
  )

console.log('Part 1:', $(input, countIncreasing))

console.log('Part 2:', $(input, zipWith($(input, slice(1)), $(input, slice(2))), map(sum), countIncreasing))
