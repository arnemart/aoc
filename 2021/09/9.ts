import {
  $,
  add,
  and,
  combinations,
  cond,
  every,
  filter,
  getIn,
  gt,
  ints,
  isNull,
  length,
  lines,
  lt,
  map,
  not,
  pipe,
  pluck,
  product,
  push,
  range,
  readInput,
  reduce,
  slice,
  some,
  sortNumeric,
  split,
  sum
} from '../../common'

type Grid = number[][]

const caveFloor: Grid = $(readInput(), lines, map(pipe(split(), ints)))

type Point = {
  x: number
  y: number
  v: number
  a?: Point[]
}

const adjacents = (x: number, y: number, grid: Grid): Point[] =>
  $(
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ],
    map(([xd, yd]) => ({ x: x + xd, y: y + yd, v: $(grid, getIn(y + yd, x + xd)) })),
    filter(pipe(pluck('v'), not(isNull)))
  )

const isLowPoint = (p: Point) => $(p.a, every(pipe(pluck('v'), gt(p.v))))

const point = (x: number, y: number, grid: Grid, filterAdjacents: (p: Point) => boolean = () => true) =>
  ({ x, y, v: $(grid, getIn(y, x)), a: $(adjacents(x, y, grid), filter(filterAdjacents)) } as Point)

const findLowPoints = (grid: Grid) =>
  $(
    range(grid.length),
    combinations(2),
    map(([x, y]) => point(x, y, grid)),
    filter(isLowPoint)
  )

console.log('Part 1:', $(caveFloor, findLowPoints, map(pipe(pluck('v'), add(1))), sum))

const notInBasin = (basin: Point[]) => (p: Point) => $(basin, not(some(bp => bp.x == p.x && bp.y == p.y)))

const findBasin = (p: Point, grid: Grid, basin: Point[] = [p]): Point[] =>
  $(point(p.x, p.y, grid, and(notInBasin(basin), pipe(pluck('v'), lt(9)))), basinPoint =>
    $(
      basinPoint.a,
      length,
      cond([[0, basin]], () =>
        $(
          basinPoint.a,
          reduce((b, ap) => $(b, push($(findBasin(ap, grid, b), filter(notInBasin(b))))), $(basin, push(basinPoint.a)))
        )
      )
    )
  )

console.log(
  'Part 2:',
  $(
    caveFloor,
    findLowPoints,
    map(p => findBasin(p, caveFloor)),
    map(length),
    sortNumeric({ reverse: true }),
    slice(0, 3),
    product
  )
)
