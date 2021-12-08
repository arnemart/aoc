import {
  $,
  arrEqual,
  count,
  filter,
  findIndex,
  first,
  flatten,
  includes,
  int,
  is,
  join,
  last,
  length,
  lines,
  map,
  not,
  overlap,
  pipe,
  readInput,
  split,
  sum,
  tee,
  without
} from '../../common'

type C = string[][]

const input: C[][] = $(readInput(), lines, map(pipe(split(' | '), map(pipe(split(' '), map(split()))))))

console.log('Part 1:', $(input, map(last), flatten(), count(pipe(length, is(2, 3, 4, 7)))))

const len = (n: number) => (codes: C) => $(codes, filter(pipe(length, is(n))))
const findLen = (n: number) => pipe(len(n), first)
const findOverlap = (code: string[], n: number) => (codes: C) =>
  $(codes, filter(pipe(overlap(code), length, is(n))), first)

const segment4 = (codes: C) =>
  $(codes, len(5), map(without($(codes, findLen(2)))), findLen(3), overlap($(codes, findLen(4))), first)

const digit0 = (codes: C) => $(codes, len(6), filter(not(includes(segment4(codes)))), first)
const digit1 = (codes: C) => $(codes, findLen(2))
const digit2 = (codes: C) => $(codes, len(5), findOverlap(digit5(codes), 3))
const digit3 = (codes: C) => $(codes, len(5), findOverlap(digit1(codes), 2))
const digit4 = (codes: C) => $(codes, findLen(4))
const digit5 = (codes: C) => $(codes, len(5), findOverlap(digit6(codes), 5))
const digit6 = (codes: C) => $(codes, len(6), findOverlap(digit1(codes), 1))
const digit7 = (codes: C) => $(codes, findLen(3))
const digit8 = (codes: C) => $(codes, findLen(7))
const digit9 = (codes: C) => $(codes, len(6), filter(includes(segment4(codes))), findOverlap(digit1(codes), 2))

const digits = tee(digit0, digit1, digit2, digit3, digit4, digit5, digit6, digit7, digit8, digit9)

console.log(
  'Part 2:',
  $(
    input,
    map(([codes, nums]) =>
      $(
        nums,
        map(n => $(codes, digits, findIndex(arrEqual(n)))),
        join(),
        int
      )
    ),
    sum
  )
)
