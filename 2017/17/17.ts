import { $, filter, inclusiveRange, map, pluck, push, reduce, shift, spy, zipWith } from '../../common'

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
      ({ pos, found }, i) => {
        const newPos = ((pos + input) % i) + 1
        return { pos: newPos, found: newPos == 1 ? i : found }
      },
      { pos: 0, found: 0 }
    ),
    pluck('found')
  )
)
