import {
  $,
  div,
  filter,
  first,
  flatten,
  inclusiveRange,
  ints,
  is,
  length,
  lines,
  map,
  pipe,
  product,
  readInput,
  sort,
  sum,
  uniquePermutations
} from '../../common'

const packages = $(readInput(), lines, ints)

const findSmallestGroup =
  (weight: number) =>
  (packages: number[]): number =>
    $(
      inclusiveRange(2, 6),
      map(n => $(packages, uniquePermutations(n))),
      flatten(),
      filter(pipe(sum, is(weight))),
      sort((a, b) => $(a, length) - $(b, length)),
      groups => $(groups, filter(pipe(length, is($(groups, first, length))))),
      sort((a, b) => $(a, product) - $(b, product)),
      first,
      product
    )

console.log('Part 1:', $(packages, findSmallestGroup($(packages, sum, div(3)))))

console.log('Part 2:', $(packages, findSmallestGroup($(packages, sum, div(4)))))
