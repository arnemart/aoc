import { $, find, frequencies, is, length, pipe, range, readInput, slice, split } from '../../common'

const input = $(readInput(), split())

const sumFloors: (floors: string[]) => number = pipe(frequencies, f => (f.get('(') || 0) - (f.get(')') || 0))

console.log('Part 1:', $(input, sumFloors))

console.log(
  'Part 2:',
  $(
    range($(input, length)),
    find(n => $(input, slice(0, n), sumFloors, is(-1)))
  )
)
