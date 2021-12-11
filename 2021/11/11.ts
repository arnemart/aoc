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

const neighbors = (x: number, y: number) =>
  $(
    $([-1, 0, 1], combinations(2), filter(not(every(is(0))))),
    map(([xd, yd]) => [x + xd, y + yd]),
    filter(and(pipe(first, within(0, width - 1)), pipe(last, within(0, height - 1))))
  )

const allOctopuses = (o: Octopuses): number[][] =>
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

const findOctopuses = (fn: (v: number) => boolean) => (os: Octopuses) => $(os, allOctopuses, filter(pipe(last, fn)))

const flashOne = (os: Octopuses, [x, y]: number[]): Octopuses =>
  $(os, setAll(add(1), neighbors(x, y)), setIn([y, x], -Infinity))

const flashAll = (os: Octopuses): Octopuses =>
  loopUntil((_, os) => $(os, findOctopuses(gt(9)), reduce(flashOne, os)), pipe(findOctopuses(gt(9)), length, is(0)), os)

const setAll =
  (fn: (n: number) => number, entries: number[][] = null) =>
  (os: Octopuses) =>
    $(
      entries || $(os, allOctopuses),
      reduce((os, o) => $(os, setIn([o[1], o[0]], fn)), os)
    )

type Result = { flashes: number; octopuses: Octopuses; steps: number }

const step = ({ octopuses, flashes, steps }: Result): Result =>
  $(octopuses, setAll(add(1)), flashAll, flashed => ({
    steps: steps + 1,
    flashes: flashes + $(flashed, findOctopuses(lt(0)), length),
    octopuses: $(flashed, setAll(clamp(0, 9)))
  }))

const result = $({ octopuses, flashes: 0, steps: 0 }, repeat(100, step))

console.log('Part 1:', $(result, pluck('flashes')))

console.log(
  'Part 2:',
  $(
    loopUntil((_, res) => $(res, step), pipe(pluck('octopuses'), allOctopuses, map(last), every(is(0))), result),
    pluck('steps')
  )
)
