import {
  $,
  difference,
  find,
  ints,
  is,
  lines,
  map,
  max,
  min,
  mod,
  pipe,
  readInput,
  sortNumeric,
  split,
  sum,
  tee,
  uniquePermutations
} from '../../common'

const spreadsheet = $(readInput(), lines, map(pipe(split(/\t/), ints)))

console.log('Part 1:', $(spreadsheet, map(pipe(tee(max, min), difference)), sum))

console.log(
  'Part 2:',
  $(
    spreadsheet,
    map(
      pipe(
        uniquePermutations(2),
        map(sortNumeric()),
        find(([a, b]) => $(b, mod(a), is(0))),
        ([a, b]) => b / a
      )
    ),
    sum
  )
)
