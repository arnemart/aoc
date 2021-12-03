import { $, filter, id, ints, length, lines, map, pipe, readInput, slice, sum, tee, zip } from '../../common'

const input = $(readInput(), lines, ints)

const countIncreasing = pipe(
  tee(id, slice(1)),
  zip,
  filter(([a, b]) => b > a),
  length
)

console.log('Part 1:', $(input, countIncreasing))

console.log('Part 2:', $(input, tee(id, slice(1), slice(2)), zip, map(sum), countIncreasing))
