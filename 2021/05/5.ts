import {
  $,
  add,
  cond,
  count,
  fillArray,
  filter,
  flatten,
  gte,
  id,
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
  tee,
  unshift,
  zipWith
} from '../../common'

type Vent = [number, number, number, number]
type Grid = number[][]
type Coord = number[]

const size = (dimension: [number, number]) => (vents: Vent[]) => $(vents, map(pluck(dimension)), flatten(), max, add(1))

const grid = (vents: Vent[]): Grid => fillArray($(vents, tee(size([1, 3]), size([0, 1]))), 0)

const ventDirection = ([x1, y1, x2, y2]: Vent) => (x1 == x2 ? 'horizontal' : y1 == y2 ? 'vertical' : 'diagonal')

const coords = pipe(tee(ventDirection, id), ([direction, [x1, y1, x2, y2]]) =>
  $(
    direction,
    cond([
      ['horizontal', $(inclusiveRange(y1, y2), map(push(x1)))],
      ['vertical', $(inclusiveRange(x1, x2), map(unshift(y1)))],
      ['diagonal', $(inclusiveRange(y1, y2), zipWith(inclusiveRange(x1, x2)))]
    ])
  )
)

const placeVent = (grid: Grid, ventCoords: Coord[]): Grid =>
  $(
    ventCoords,
    reduce((grid, c) => $(grid, setIn(c, add(1))), grid)
  )
const placeVents = (vents: Vent[]): Grid => $(vents, map(coords), reduce(placeVent, $(vents, grid)))

const score = pipe(flatten(), count(gte(2)))

const input = $(readInput(), lines, map(pipe(split(/[^\d]+/), ints))) as Vent[]
const part1input = $(input, filter(pipe(ventDirection, is('horizontal', 'vertical'))))

console.log('Part 1:', $(part1input, placeVents, score))

console.log('Part 2:', $(input, placeVents, score))
