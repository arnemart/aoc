import {
  $,
  allEqual,
  filter,
  first,
  id,
  intdiv,
  ints,
  length,
  map,
  readInput,
  shift,
  split,
  sum,
  tee,
  zip
} from '../../common'

const digits = $(readInput(), split(), ints)

console.log('Part 1:', $(digits, tee(id, shift(1)), zip, filter(allEqual), map(first), sum))

console.log('Part 2:', $(digits, tee(id, shift($(digits, length, intdiv(2)))), zip, filter(allEqual), map(first), sum))
