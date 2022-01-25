import {
  $,
  allEqual,
  combine,
  count,
  fillArray,
  filter,
  flatmap,
  inclusiveRange,
  int,
  is,
  join,
  last,
  loopUntil,
  map,
  max,
  min,
  parse,
  pipe,
  pluck,
  range,
  readInput,
  reduce,
  setIn,
  subtract,
  sum,
  takeWhile,
  tee
} from '../../common'

const startClay = $(
  readInput(),
  parse(/([xy])=(\d+), [yx]=(\d+)\.\.(\d+)/, ([_, dir, v1, v2, v3]) => ({
    x: dir == 'x' ? [int(v1)] : inclusiveRange(int(v2), int(v3)),
    y: dir == 'y' ? [int(v1)] : inclusiveRange(int(v2), int(v3))
  }))
)

const [minX, maxX] = $(startClay, flatmap(pluck('x')), tee(min, max))
const [minY, maxY] = $(startClay, flatmap(pluck('y')), tee(min, max))

const clay = $(
  startClay,
  map(({ x, y }) => ({
    x: $(x, map(subtract(minX - 2))),
    y: $(y, map(subtract(minY)))
  }))
)

const springX = 500 - minX + 2

const width = maxX - minX + 2
const height = maxY - minY + 1

type Grid = string[][]

const grid = $(
  clay,
  reduce(
    (grid, { x, y }) =>
      $(
        [y, x],
        combine,
        reduce((grid, p) => $(grid, setIn(p, '#')), grid)
      ),
    fillArray([width + 2, height], ' ')
  ),
  setIn([0, springX], '|')
) as Grid

const findWaters = (grid: Grid) =>
  $(
    [range(grid.length), range(grid[0].length)],
    combine,
    filter(([y, x]) => grid[y][x] == '|' && (grid[y + 1]?.[x] == ' ' || $(grid[y + 1]?.[x], is('~', '#'))))
  )

const fillWater = (grid: Grid, [y, x]: number[]): Grid => {
  if (grid[y][x] != '|') {
    // Has been converted to still water
    return grid
  }
  const below = grid[y + 1]?.[x]
  const left = grid[y][x - 1]
  const right = grid[y][x + 1]

  if (below == ' ') {
    // Water falls down
    return $(
      inclusiveRange(y + 1, height),
      takeWhile(newY => grid[newY]?.[x] == ' '),
      reduce((grid, newY) => $(grid, setIn([newY, x], '|')), grid)
    )
  } else if ($(below, is('#', '~'))) {
    if (left == '|' && right == '|') {
      // Convert flowing water to still water
      const toTheLeft = $(
        inclusiveRange(x - 1, 0),
        takeWhile(newX => grid[y][newX] == '|')
      )
      const leftmost = toTheLeft.length == 0 ? x : $(toTheLeft, last)
      const toTheRight = $(
        inclusiveRange(x + 1, width),
        takeWhile(newX => grid[y][newX] == '|')
      )
      const rightmost = toTheRight.length == 0 ? x : $(toTheRight, last)
      if (grid[y][leftmost - 1] == '#' && grid[y][rightmost + 1] == '#') {
        const toConvert = [...toTheLeft, x, ...toTheRight]
        // Fill any 1 tile wide gaps beneath this row of flowing water
        const gapsFilledBelow = $(
          toConvert,
          reduce(
            (grid, newX) =>
              $(
                grid,
                setIn([y + 1, newX], s => (s == ' ' ? '|' : s))
              ),
            grid
          )
        )
        return $(
          toConvert,
          reduce((grid, newX) => $(grid, setIn([y, newX], '~')), gapsFilledBelow)
        )
      } else {
        return grid
      }
    } else {
      // Water flows outwards
      const toTheLeft = $(
        inclusiveRange(x - 1, 0),
        takeWhile(newX => $(grid[y][newX], is(' ', '|')) && $(grid[y + 1][newX], is('~', '#')))
      )
      const leftmost = toTheLeft.length == 0 ? x : $(toTheLeft, last)
      const toTheRight = $(
        inclusiveRange(x + 1, width),
        takeWhile(newX => grid[y][newX] == ' ' && $(grid[y + 1][newX], is('~', '#')))
      )
      const rightmost = toTheRight.length == 0 ? x : $(toTheRight, last)
      const leftWall = grid[y][leftmost - 1] == '#'
      const rightWall = grid[y][rightmost + 1] == '#'
      if (leftWall && rightWall) {
        return $(
          [...toTheLeft, x, ...toTheRight],
          reduce((grid, newX) => $(grid, setIn([y, newX], '~')), grid)
        )
      } else {
        return $(
          [...(leftWall ? [] : [leftmost - 1]), ...toTheLeft, x, ...toTheRight, ...(rightWall ? [] : [rightmost + 1])],
          reduce((grid, newX) => $(grid, setIn([y, newX], '|')), grid)
        )
      }
    }
  }
}

const colors = {
  '~': 0x0000ffff,
  '|': 0x00aaffff,
  '#': 0x000000ff
}

const countWater =
  (...whichWater: string[]) =>
  (grid: Grid) =>
    $(grid, map(count(is(...whichWater))), sum)

const finalGrid = loopUntil(
  (i, { grid, gridstr }) =>
    $(grid, findWaters, reduce(fillWater, grid), grid => ({
      grid,
      gridstr: $(grid, map(join()), join()),
      prevgridstr: gridstr
    })),
  pipe(pluck(['gridstr', 'prevgridstr']), allEqual),
  { grid, gridstr: 'a', prevgridstr: 'aa' }
).grid

console.log('Part 1:', $(finalGrid, countWater('|', '~')))

console.log('Part 2:', $(finalGrid, countWater('~')))
