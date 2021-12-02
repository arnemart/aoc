import {
  $,
  filter,
  flatten,
  ints,
  is,
  length,
  lines,
  loopUntil,
  map,
  pipe,
  range,
  readInput,
  sum,
  uniquePermutations
} from '../../common'

const containers = $(readInput(), lines, ints)

console.log(
  'Part 1:',
  $(
    range(7),
    map(n => $(containers, uniquePermutations(n + 2))),
    flatten(),
    filter(pipe(sum, is(150))),
    length
  )
)

console.log(
  'Part 2:',
  loopUntil(
    n => $(containers, uniquePermutations(n + 2), filter(pipe(sum, is(150))), length),
    count => count > 0
  )
)
