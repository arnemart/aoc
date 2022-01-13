import {
  $,
  chop,
  fillArray,
  flatten,
  join,
  last,
  leftPad,
  map,
  pipe,
  push,
  range,
  reduce,
  reverse,
  shift,
  slice,
  split,
  sum,
  tee,
  toString
} from '../../common'

export const getSkipSizes = (lengths: number[]) =>
  $(
    lengths,
    map((a, i) => [a, a + i]),
    map(([a], i, arr) => [a, $(arr, slice(0, i), map(last), sum)])
  )

const flip = (length: number, pos: number) => (list: number[]) =>
  $(list, shift(-pos), tee(pipe(slice(0, length), reverse), slice(length)), flatten(), shift(pos))

export const run = (input: number[][]) =>
  $(
    input,
    reduce((list, [length, pos]) => $(list, flip(length, pos)), range(256))
  )

export const knothash = (input: string) =>
  $(
    input,
    split(),
    map(s => s.charCodeAt(0)),
    push([17, 31, 73, 47, 23]),
    lengths => fillArray(64, lengths),
    flatten(),
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
