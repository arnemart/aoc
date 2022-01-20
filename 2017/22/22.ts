import {
  $,
  add,
  clone,
  cond,
  fillArray,
  floor,
  getIn,
  lines,
  map,
  next,
  push,
  readInput,
  repeat,
  setIn,
  split,
  unshift
} from '../../common'

type Grid = string[][]
const startGrid: Grid = $(readInput(), lines, map(split()))

type Dir = 'u' | 'r' | 'd' | 'l'
const dirs: Dir[] = ['u', 'r', 'd', 'l']
const deltas = {
  u: [-1, 0],
  r: [0, 1],
  d: [1, 0],
  l: [0, -1]
}

type State = { grid: Grid; y: number; x: number; dir: Dir; infs: number }

const expandu = (s: State): State => ({
  ...s,
  y: s.y + 1,
  grid: [fillArray(s.grid[0].length, '.'), ...s.grid]
})

const expandr = (s: State): State => ({
  ...s,
  grid: $(s.grid, map(push('.')))
})

const expandd = (s: State): State => ({
  ...s,
  grid: [...s.grid, fillArray(s.grid[0].length, '.')]
})

const expandl = (s: State): State => ({
  ...s,
  x: s.x + 1,
  grid: $(s.grid, map(unshift('.')))
})

const step =
  (infectionStates: string[], nextDir: Record<string, number>, toCount: string) =>
  (s: State): State =>
    $(
      s,
      getIn('grid', s.y, s.x),
      v =>
        ({
          ...s,
          dir: $(s.dir, next(dirs, nextDir[v])),
          grid: $(s.grid, setIn([s.y, s.x], $(v, next(infectionStates)))),
          infs: $(s.infs, add($(v, cond([[toCount, 1]], 0))))
        } as State),
      s => ({ ...s, y: s.y + deltas[s.dir][0], x: s.x + deltas[s.dir][1] } as State),
      s =>
        s.y < 0
          ? expandu(s)
          : s.x >= s.grid[0].length
          ? expandr(s)
          : s.y >= s.grid.length
          ? expandd(s)
          : s.x < 0
          ? expandl(s)
          : s
    )

const initialState = (): State => ({
  grid: clone(startGrid),
  y: floor(startGrid.length / 2),
  x: floor(startGrid[0].length / 2),
  dir: 'u',
  infs: 0
})

const step1 = step(['.', '#'], { '#': 1, '.': -1 }, '.')

const final = $(initialState(), repeat(10000, step1))

console.log('Part 1:', final.infs)

const step2 = step(['.', 'w', '#', 'f'], { '#': 1, '.': -1, w: 0, f: 2 }, 'w')

const final2 = $(initialState(), repeat(10000000, step2))

console.log('Part 2:', final2.infs)
