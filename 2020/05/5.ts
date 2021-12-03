import { $, lines, map, number, pipe, readInput, replace, sortNumeric } from '../../common'

const seats: number[] = $(
  readInput(),
  lines,
  map(pipe(replace(/[FL]/g, '0'), replace(/[RB]/g, '1'))),
  map(number(2)),
  sortNumeric({ reverse: true })
)

console.log('Part 1:', seats[0])

console.log('Part 2:', seats.find((seat, index) => seats[index + 1] == seat - 2) - 1)
