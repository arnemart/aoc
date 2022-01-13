import { $, add, filter, inclusiveRange, map, mod, pluck, push, reduce, shift, spy, zipWith } from '../../common'

const input = 369

const buffer = $(
  inclusiveRange(1, 2017),
  reduce((buf, i) => $(buf, shift(-input), push(i)), [0])
)

console.log('Part 1:', buffer[0])

console.log(
  'Part 2:',
  $(
    inclusiveRange(1, 50000000),
    reduce(
      ({ pos, found }, i) =>
        $(pos, add(input), mod(i), add(1), pos => ({
          pos,
          found: pos == 1 ? i : found
        })),
      { pos: 0, found: 0 }
    ),
    pluck('found')
  )
)
