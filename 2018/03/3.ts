import {
  $,
  combine,
  every,
  filter,
  find,
  gt,
  ints,
  join,
  length,
  map,
  parse,
  pipe,
  pluck,
  range,
  readInput,
  reduce,
  slice,
  values
} from '../../common'

const claims = $(
  readInput(),
  parse(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/, pipe(slice(1, 6), ints)),
  map(([id, x, y, w, h]) => ({
    id,
    coords: $([range(x, x + w), range(y, y + h)], combine, map(join(',')))
  }))
)

const claimed = $(
  claims,
  reduce(
    (claimed, { coords }) =>
      $(
        coords,
        reduce((claimed, coord) => claimed.set(coord, (claimed.get(coord) || 0) + 1), claimed)
      ),
    new Map<string, number>()
  )
)

console.log('Part 1:', $(claimed, values, filter(gt(1)), length))

const theonethatdoesnotoverlap = $(
  claims,
  find(
    pipe(
      pluck('coords'),
      every(c => claimed.get(c) == 1)
    )
  )
)

console.log('Part 2:', theonethatdoesnotoverlap.id)
