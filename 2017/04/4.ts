import {
  $,
  allEqual,
  filter,
  id,
  join,
  length,
  lines,
  map,
  pipe,
  readInput,
  sort,
  split,
  tee,
  unique
} from '../../common'

const passphrases = $(readInput(), lines, map(split(' ')))

const countValid = (pws: string[][]) => $(pws, filter(pipe(tee(id, unique), map(length), allEqual)), length)

console.log('Part 1:', $(passphrases, countValid))

console.log('Part 2:', $(passphrases, map(map(pipe(split(), sort(), join()))), countValid))
