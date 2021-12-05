import {
  $,
  add,
  cond,
  count,
  fillArray,
  filter,
  flatten,
  gte,
  inclusiveRange,
  ints,
  is,
  lines,
  map,
  max,
  pipe,
  pluck,
  push,
  readInput,
  reduce,
  setIn,
  split,
  unshift,
  zipWith
} from '../../common'

type Vent = [number, number, number, number]
type Grid = number[][]
type Coord = number[]

const input = $(readInput(), lines, map(pipe(split(/[^\d]+/), ints))) as Vent[]

const ventDirection = ([x1, y1, x2, y2]: Vent) => (x1 == x2 ? 'horizontal' : y1 == y2 ? 'vertical' : 'diagonal')

const part1input = $(input, filter(pipe(ventDirection, is('horizontal', 'vertical'))))

const width = (vents: Vent[]) => $(vents, map(pluck([0, 2])), flatten(), max, add(1))
const height = (vents: Vent[]) => $(vents, map(pluck([1, 3])), flatten(), max, add(1))

const grid = (vents: Vent[]): Grid => fillArray([$(vents, height), $(vents, width)], 0)

const coords = ([x1, y1, x2, y2]: Vent): Coord[] =>
  $(
    [x1, y1, x2, y2],
    ventDirection,
    cond([
      ['horizontal', $(inclusiveRange(y1, y2), map(push(x1)))],
      ['vertical', $(inclusiveRange(x1, x2), map(unshift(y1)))],
      ['diagonal', $(inclusiveRange(y1, y2), zipWith(inclusiveRange(x1, x2)))]
    ])
  )

const placeVent = (grid: Grid, ventCoords: Coord[]): Grid =>
  $(
    ventCoords,
    reduce((grid, c) => $(grid, setIn(c, add(1))), grid)
  )
const placeVents = (vents: Vent[]): Grid => $(vents, map(coords), reduce(placeVent, $(vents, grid)))

const score = pipe(flatten(), count(gte(2)))

console.log('Part 1:', $(part1input, placeVents, score))

console.log('Part 2:', $(input, placeVents, score))
