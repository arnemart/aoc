import {
  $,
  abs,
  combine,
  every,
  filter,
  first,
  groupBy,
  ints,
  last,
  length,
  lines,
  lt,
  map,
  mapEntries,
  max,
  pipe,
  pluck,
  range,
  readInput,
  sortBy,
  split,
  sum,
  within
} from '../../common'

const points = $(readInput(), lines, map(pipe(split(', '), ints)))

const maxX = $(points, map(first), max)
const maxY = $(points, map(last), max)

const gridPoints = $(
  $(
    [range(maxX), range(maxY)],
    combine,
    map(([x, y]) =>
      $(
        points,
        map(([px, py], i) => ({ i, dist: $([y - py, x - px], map(abs), sum) })),
        sortBy(pluck('dist')),
        dists => ({
          x,
          y,
          closest: dists[0].dist == dists[1].dist ? -1 : dists[0].i,
          sum: $(dists, map(pluck('dist')), sum)
        })
      )
    )
  )
)

const areas = $(
  gridPoints,
  groupBy(pluck('closest')),
  mapEntries,
  map(([i, points]) => ({ i, points: $(points, map(pluck(['x', 'y']))) })),
  filter(
    pipe(
      pluck('points'),
      every(([x, y]) => $(x, within(1, maxX - 2)) && $(y, within(1, maxY - 2)))
    )
  ),
  map(pipe(pluck('points'), length))
)

console.log('Part 1:', $(areas, max))

console.log('Part 2:', $(gridPoints, map(pluck('sum')), filter(lt(10000)), length))
