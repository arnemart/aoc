import {
  $,
  add,
  and,
  clamp,
  combinations,
  every,
  filter,
  first,
  flatten,
  gt,
  ints,
  is,
  last,
  length,
  lines,
  loopUntil,
  lt,
  map,
  not,
  pipe,
  pluck,
  readInput,
  reduce,
  repeat,
  setIn,
  split,
  within
} from '../../common'

type Octopuses = number[][]

const octopuses: Octopuses = $(readInput(), lines, map(pipe(split(), ints)))

const height = $(octopuses, length)
const width = $(octopuses, first, length)

const deltas = $([-1, 0, 1], combinations(2), filter(not(every(is(0)))))
const neighbors = (x: number, y: number, o: Octopuses) =>
  $(
    deltas,
    map(([xd, yd]) => [x + xd, y + yd]),
    filter(and(pipe(first, within(0, width - 1)), pipe(last, within(0, height - 1)))),
    map(([x, y]) => [x, y, o[y][x]])
  )

const entries2d = (o: Octopuses): number[][] =>
  $(
    o,
    map((row, y) =>
      $(
        row,
        map((oct, x) => [x, y, oct])
      )
    ),
    flatten()
  )

const findOctopuses = (fn: (v: number) => boolean) => (os: Octopuses) => $(os, entries2d, filter(pipe(last, fn)))
const flashers = findOctopuses(gt(9))

const flashOne = (os: Octopuses, [x, y]: number[]): Octopuses =>
  $(
    neighbors(x, y, octopuses),
    reduce((os, n) => $(os, setIn([n[1], n[0]], add(1))), os),
    setIn([y, x], -Infinity)
  )

const flashAll = (os: Octopuses): Octopuses =>
  loopUntil((_, os) => $(os, flashers, reduce(flashOne, os)), pipe(flashers, length, is(0)), os)

const incrementAll = (os: Octopuses) =>
  $(
    os,
    entries2d,
    reduce((os, o) => $(os, setIn([o[1], o[0]], add(1))), os)
  )

type Result = { flashes: number; octopuses: Octopuses; steps: number }

const step = ({ octopuses, flashes, steps }: Result): Result =>
  $(octopuses, incrementAll, flashAll, flashed => ({
    steps: steps + 1,
    flashes: $(flashed, findOctopuses(lt(0)), length, add(flashes)),
    octopuses: $(
      flashed,
      entries2d,
      reduce((os, o) => $(os, setIn([o[1], o[0]], clamp(0, 9))), flashed)
    )
  }))

const result = $({ octopuses: octopuses, flashes: 0, steps: 0 }, repeat(100, step))

console.log('Part 1:', $(result, pluck('flashes')))

console.log(
  'Part 2:',
  $(
    loopUntil(
      (_, res) => $(res, step),
      pipe(pluck('octopuses'), findOctopuses(is(0)), length, is(width * height)),
      result
    ),
    pluck('steps')
  )
)
