import {
  $,
  allEqual,
  count,
  filter,
  find,
  first,
  frequencies,
  is,
  join,
  lines,
  map,
  not,
  pipe,
  product,
  readInput,
  some,
  split,
  tee,
  uniquePermutations,
  values,
  zip
} from '../../common'

const boxes = $(readInput(), lines)

console.log(
  'Part 1:',
  $(boxes, map(pipe(split(), frequencies, values)), tee(count(some(is(2))), count(some(is(3)))), product)
)

const countDifferences = ([id1, id2]: string[]) => $([id1, id2], map(split()), zip, count(not(allEqual)))

console.log(
  'Part 2:',
  $(
    boxes,
    uniquePermutations(2),
    find(pipe(countDifferences, is(1))),
    map(split()),
    zip,
    filter(allEqual),
    map(first),
    join()
  )
)
