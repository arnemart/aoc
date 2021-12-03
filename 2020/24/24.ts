import {
  $,
  cond,
  count,
  fillArray,
  find,
  getIn,
  is,
  lines,
  map,
  pipe,
  range,
  readInput,
  reduce,
  repeat,
  sum
} from '../../common'

type Dir = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w'
type Dirs = Dir[]
type Coord = { x: number; y: number }
type Grid = ('w' | 'b')[][]

const dirs: Dirs = ['se', 'sw', 'ne', 'nw', 'e', 'w']

const consume =
  (patterns: string[]) =>
  (s: string): Dirs => {
    const p = $(
      patterns,
      find(p => s.startsWith(p))
    ) as Dir
    return s.length > p.length ? [p, ...$(s.slice(p.length), consume(patterns))] : [p]
  }

const input: Dirs[] = $(readInput(), lines, map(consume(dirs)))

const go = (p: Coord, dir: Dir) =>
  $(
    dir,
    cond([
      ['e', { x: p.x + 1, y: p.y }],
      ['w', { x: p.x - 1, y: p.y }],
      ['sw', { x: p.x - (p.y % 2), y: p.y + 1 }],
      ['se', { x: p.x + ((p.y + 1) % 2), y: p.y + 1 }],
      ['nw', { x: p.x - (p.y % 2), y: p.y - 1 }],
      ['ne', { x: p.x + ((p.y + 1) % 2), y: p.y - 1 }]
    ])
  )

const step1 = (grid: Grid, dirs: Dirs): Grid =>
  $(dirs, reduce(go, start), ({ x, y }) => {
    grid[y][x] = grid[y][x] == 'w' ? 'b' : 'w'
    return grid
  })

const countBlack = pipe(map(count(is('b'))), sum)

const startGrid = $(
  range(200),
  map(() => fillArray(200, 'w'))
)
const start: Coord = { x: 100, y: 100 }

const grid = $(input, reduce(step1, startGrid))

console.log('Part 1:', $(grid, countBlack))

const countNeighbours = (grid: Grid, coord: Coord) =>
  $(
    dirs,
    map(
      pipe(
        dir => go(coord, dir),
        ({ x, y }) => $(grid, getIn(y, x))
      )
    ),
    count(is('b'))
  )

const step2 = (grid: Grid): Grid =>
  $(
    grid,
    map((row, y) =>
      $(
        row,
        map((tile, x) => {
          const neighbours = countNeighbours(grid, { x, y })
          if (tile == 'b') {
            return neighbours == 0 || neighbours > 2 ? 'w' : 'b'
          } else {
            return neighbours == 2 ? 'b' : 'w'
          }
        })
      )
    )
  )

console.log('Part 2:', $(grid, repeat(100, step2), countBlack))
