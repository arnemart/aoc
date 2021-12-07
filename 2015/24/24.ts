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
  sortBy,
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
      sortBy(length),
      groups => $(groups, filter(pipe(length, is($(groups, first, length))))),
      sortBy(product),
      first,
      product
    )

console.log('Part 1:', $(packages, findSmallestGroup($(packages, sum, div(3)))))

console.log('Part 2:', $(packages, findSmallestGroup($(packages, sum, div(4)))))
