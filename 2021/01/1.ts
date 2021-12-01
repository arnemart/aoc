import { $, filter, flatten, ints, length, lines, map, pipe, readInput, slice, spy, sum, zipWith } from '../../common'

const input = $(readInput(), lines, ints, spy)

console.log(
  'Part 1:',
  $(
    input,
    zipWith($(input, slice(1))),
    filter(([a, b]) => b > a),
    length
  )
)

console.log(
  'Part 2:',
  $(input, zipWith($(input, slice(1))), zipWith($(input, slice(2))), map(pipe(flatten(), sum)), newInput =>
    $(
      newInput,
      zipWith($(newInput, slice(1))),
      filter(([a, b]) => b > a),
      length
    )
  )
)
