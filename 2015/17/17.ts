import {
  $,
  filter,
  flatmap,
  ints,
  is,
  length,
  lines,
  loopUntil,
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
    flatmap(n => $(containers, uniquePermutations(n + 2))),
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
