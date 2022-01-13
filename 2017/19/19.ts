import { $, find, findIndex, is, lines, loopUntil, map, pluck, readInput, split, test } from '../../common'

const grid = $(readInput(), lines, map(split()))

type Dir = 'u' | 'd' | 'r' | 'l'
type State = { y: number; x: number; dir: Dir; letters: string; steps: number }
const dirs = { u: [-1, 0], d: [1, 0], l: [0, -1], r: [0, 1] }
const nextDirs: Record<string, Dir[]> = { u: ['l', 'r'], d: ['l', 'r'], l: ['u', 'd'], r: ['u', 'd'] }

const start: State = { y: 0, x: $(grid[0], findIndex(is('|'))), dir: 'd', letters: '', steps: 0 }

const step = (state: State): State => {
  const y = state.y + dirs[state.dir][0]
  const x = state.x + dirs[state.dir][1]
  const v = grid[y]?.[x]
  return {
    y,
    x,
    steps: state.steps + 1,
    dir:
      v == '+'
        ? $(
            nextDirs[state.dir],
            find(d => $(grid[y + dirs[d][0]]?.[x + dirs[d][1]] || ' ', test(/[A-Z|-]/)))
          )
        : state.dir,
    letters: state.letters + ($(v, test(/[A-Z]/)) ? v : '')
  }
}

const done = $(
  loopUntil(
    (_, state) => step(state),
    ({ y, x }) => grid[y]?.[x] == ' ',
    start
  )
)

console.log('Part 1:', $(done, pluck('letters')))

console.log('Part 2:', $(done, pluck('steps')))
