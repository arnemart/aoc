import {
  $,
  combinations,
  cond,
  count,
  every,
  filter,
  flatmap,
  frequencies,
  getIn,
  gt,
  gte,
  id,
  ife,
  indexOf,
  is,
  last,
  length,
  lines,
  loopUntil,
  map,
  mapEntries,
  min,
  not,
  pipe,
  pluck,
  product,
  readInput,
  repeat,
  some,
  split,
  tee,
  values
} from '../../common'

type Forest = string[][]
const forest: Forest = $(readInput(), lines, map(split()))

const neighbors = $([-1, 0, 1], combinations(2), filter(not(every(is(0)))))

const countNeighbors = (grid: Forest, x: number, y: number, v: string): number =>
  $(
    neighbors,
    map(([yDelta, xDelta]) => $(grid, getIn(y + yDelta, x + xDelta))),
    filter(is(v)),
    length
  )

const step = (forest: Forest) =>
  $(
    forest,
    map((row, y) =>
      $(
        row,
        map((v, x) =>
          $(
            v,
            cond([
              ['.', () => $(countNeighbors(forest, x, y, '|'), gte(3), ife('|', v))],
              ['|', () => $(countNeighbors(forest, x, y, '#'), gte(3), ife('#', v))],
              [
                '#',
                () =>
                  $(countNeighbors(forest, x, y, '#'), gte(1)) && $(countNeighbors(forest, x, y, '|'), gte(1)) ? '#' : '.'
              ]
            ])
          )
        )
      )
    )
  )

const value = (forest: Forest) => $(forest, flatmap(id), tee(count(is('|')), count(is('#'))), product)

console.log('Part 1:', $(forest, repeat(10, step), value))

const valuesAfterAWhile = $(
  loopUntil(
    (_, { forests, vals }) =>
      $(forests, last, step, newForest => ({
        forests: [...forests, newForest],
        vals: [...vals, value(newForest)]
      })),
    pipe(pluck('vals'), frequencies, values, some(gte(10))),
    { forests: [forest], vals: [value(forest)] }
  ).vals
)

const [loopSize, loopStartsAt] = $(
  valuesAfterAWhile,
  frequencies,
  mapEntries,
  filter(pipe(last, gt(5))),
  map(n => $(valuesAfterAWhile, indexOf(n[0]))),
  tee(length, min)
)

console.log('Part 2:', valuesAfterAWhile[loopStartsAt + loopSize * 10 + ((1000000000 - loopStartsAt) % loopSize)])
