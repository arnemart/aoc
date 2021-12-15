import {
  $,
  and,
  arrEqual,
  every,
  filter,
  flatten,
  gte,
  ints,
  join,
  lines,
  map,
  pipe,
  range,
  readInput,
  split
} from '../../common'

import aStar = require('a-star')

type Grid = number[][]
const ceiling: Grid = $(readInput(), lines, map(pipe(split(), ints)))

const findNeighbors =
  (maxX: number, maxY: number) =>
  ([x, y]) =>
    $(
      [
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
        [x, y - 1]
      ],
      filter(and(every(gte(0)), ([x, y]) => x <= maxX && y <= maxY))
    )

const findPath = (grid: Grid) => {
  const maxX = grid[0].length - 1
  const maxY = grid.length - 1
  return aStar({
    start: [0, 0],
    isEnd: arrEqual([maxX, maxY]),
    neighbor: findNeighbors(maxX, maxY),
    distance: (_, [x, y]) => grid[y][x],
    heuristic: ([x, y]) => maxX - x + (maxY - y),
    hash: join(',')
  }).cost
}

console.log('Part 1:', findPath(ceiling))

const addAndWrap = (n1: number) => (n2: number) => n1 + n2 > 9 ? ((n1 + n2) % 10) + 1 : n1 + n2

const theActualCeilingWhichIsLarger = $(
  range(5),
  map(row =>
    $(
      range(ceiling.length),
      map(y =>
        $(
          range(5),
          map(x => $(ceiling[y], map(addAndWrap(x + row)))),
          flatten()
        )
      )
    )
  ),
  flatten()
)

console.log('Part 2:', findPath(theActualCeilingWhichIsLarger))
