import {
  $,
  chop,
  fillArray,
  flatten,
  ints,
  join,
  last,
  leftPad,
  map,
  pipe,
  product,
  push,
  range,
  readInput,
  reduce,
  reverse,
  shift,
  slice,
  split,
  sum,
  tee,
  toString
} from '../../common'

const inputList = range(256)

const inputLengths = $(readInput(), split(','), ints)

const getSkipSizes = (lengths: number[]) =>
  $(
    lengths,
    map((a, i) => [a, a + i]),
    map(([a], i, arr) => [a, $(arr, slice(0, i), map(last), sum)])
  )

const flip = (length: number, pos: number) => (list: number[]) =>
  $(list, shift(-pos), tee(pipe(slice(0, length), reverse), slice(length)), flatten(), shift(pos))

const run = (input: number[][]) =>
  $(
    input,
    reduce((list, [length, pos]) => $(list, flip(length, pos)), inputList)
  )

console.log('Part 1:', $(inputLengths, getSkipSizes, run, slice(0, 2), product))

const inputLengthsPart2 = $(
  readInput(),
  split(),
  map(s => s.charCodeAt(0)),
  push([17, 31, 73, 47, 23]),
  lengths => fillArray(64, lengths),
  flatten()
)

console.log(
  'Part 2:',
  $(
    inputLengthsPart2,
    getSkipSizes,
    run,
    chop(16),
    map(
      pipe(
        ([first, ...rest]) =>
          $(
            rest,
            reduce((a, b) => a ^ b, first)
          ),
        toString(16),
        leftPad(2, '0')
      )
    ),
    join()
  )
)
