import {
  $,
  add,
  count,
  fillArray,
  filter,
  flatten,
  inclusiveRange,
  ints,
  lines,
  map,
  max,
  pipe,
  pluck,
  readInput,
  reduce,
  setIn,
  split,
  zipWith
} from '../../common'

type Vent = [number, number, number, number]
type Grid = number[][]
type Coord = number[]

const input = $(readInput(), lines, map(pipe(split(/[^\d]+/), ints))) as Vent[]

const part1input = $(
  input,
  filter(([x1, y1, x2, y2]) => x1 == x2 || y1 == y2)
)

const width = (vents: Vent[]) => $(vents, map(pluck([0, 2])), flatten(), max, add(1))
const height = (vents: Vent[]) => $(vents, map(pluck([1, 3])), flatten(), max, add(1))

const grid = (vents: Vent[]): Grid => fillArray([$(vents, height), $(vents, width)], 0)

const coords = ([x1, y1, x2, y2]: Vent): Coord[] =>
  x1 == x2
    ? $(
        inclusiveRange(y1, y2),
        map(y => [y, x1])
      )
    : y1 == y2
    ? $(
        inclusiveRange(x1, x2),
        map(x => [y1, x])
      )
    : $(inclusiveRange(y1, y2), zipWith(inclusiveRange(x1, x2)))

const fillVent = (grid: Grid, ventCoords: Coord[]): Grid =>
  $(
    ventCoords,
    reduce((grid, c) => $(grid, setIn(c, add(1))), grid)
  )
const placeVents = (vents: Vent[]): Grid => $(vents, map(coords), reduce(fillVent, $(vents, grid)))

const score = pipe(
  flatten(),
  count(n => n >= 2)
)

console.log('Part 1:', $(part1input, placeVents, score))

console.log('Part 2:', $(input, placeVents, score))
