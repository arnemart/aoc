import { $, difference, frequencies, ints, lines, map, pipe, readInput, sortNumeric, split, sum, zip } from '../../common'

const [list1, list2] = $(readInput(), lines, map(split(/\s+/)), zip, map(pipe(ints, sortNumeric())))
const diff = $([list1, list2], zip, map(difference), sum)
const freqs = frequencies(list2)
const sim = $(
  list1,
  map(v => v * freqs.get(v) || 0),
  sum
)

console.log('Part 1:', diff)
console.log('Part 2:', sim)
