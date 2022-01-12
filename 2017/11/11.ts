import { $, abs, ceil, cond, max, pluck, readInput, reduce, split } from '../../common'

const path = $(readInput('se,sw,se,sw,sw', false), split(','))

const step = ([x, y]: number[], dir: string) =>
  $(
    dir,
    cond([
      ['n', [x, y - 2]],
      ['s', [x, y + 2]],
      ['sw', [x - abs(y % 2), y + 1]],
      ['se', [x + abs((y + 1) % 2), y + 1]],
      ['nw', [x - abs(y % 2), y - 1]],
      ['ne', [x + abs((y + 1) % 2), y - 1]]
    ])
  )

const dist = ([x, y]) => abs(x) + ceil(abs(y) / 2)

console.log('Part 1:', $(path, reduce(step, [0, 0]), dist))

const allDists = $(
  path,
  reduce(
    ({ x, y, dists }, dir) => {
      const [x2, y2] = step([x, y], dir)
      return { x: x2, y: y2, dists: [...dists, dist([x2, y2])] }
    },
    { x: 0, y: 0, dists: [] }
  ),
  pluck('dists')
)

console.log('Part 2:', $(allDists, max))
