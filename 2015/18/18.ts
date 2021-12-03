import {
  $,
  combinations,
  cond,
  every,
  filter,
  flatten,
  getIn,
  is,
  length,
  lines,
  map,
  not,
  pipe,
  readInput,
  reduce,
  repeat,
  setIn,
  split
} from '../../common'

type Grid = boolean[][]
type Coord = [number, number]

const input = $(readInput(), lines, map(pipe(split(), map(is('#')))))

const neighbors = $([-1, 0, 1], combinations(2), filter(not(every(is(0)))))

const countNeighbors =
  (grid: Grid) =>
  ([y, x]: Coord): number =>
    $(
      neighbors,
      map(([yDelta, xDelta]) => $(grid, getIn(y + yDelta, x + xDelta))),
      filter(Boolean),
      length
    )

const step = (grid: Grid): Grid =>
  $(
    grid,
    map((row, y) =>
      $(
        row,
        map((v, x) =>
          $(
            [y, x],
            countNeighbors(grid),
            cond(
              [
                [3, true],
                [2, v]
              ],
              false
            )
          )
        )
      )
    )
  )

const countActive = pipe(flatten(), filter(Boolean), length)

console.log('Part 1:', $(input, repeat(100, step), countActive))

const turnOnCornerLights = (grid: Grid): Grid =>
  $(
    [
      [0, 0],
      [0, grid[0].length - 1],
      [grid.length - 1, 0],
      [grid.length - 1, grid[0].length - 1]
    ],
    reduce((grid, corner) => $(grid, setIn(corner, true)), grid)
  )

console.log('Part 2:', $(input, turnOnCornerLights, repeat(100, pipe(step, turnOnCornerLights)), countActive))
