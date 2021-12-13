import {
  $,
  and,
  cond,
  filter,
  find,
  flatten,
  isNull,
  last,
  length,
  loopUntil,
  map,
  max,
  md5,
  not,
  pipe,
  pluck,
  push,
  some,
  split,
  substr,
  within
} from '../../common'

const dirs = ['U', 'D', 'L', 'R']
const deltas = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}

const whichDoorsAreOpen = (passcode: string) =>
  $(
    passcode,
    md5,
    substr(0, 4),
    split(),
    map((c, i) => $(c, cond([[['b', 'c', 'd', 'e', 'f'], dirs[i]]], null))),
    filter(not(isNull))
  )

type State = { x: number; y: number; path: string }

const whereGo =
  (passcode: string) =>
  ({ x, y, path }: State): State[] =>
    $(
      passcode + path,
      whichDoorsAreOpen,
      map(d => ({ x: x + deltas[d][0], y: y + deltas[d][1], path: path + d })),
      filter(and(pipe(pluck('x'), within(0, 3)), pipe(pluck('y'), within(0, 3))))
    )

const reachedTheExit = ({ x, y }: State) => x == 3 && y == 3

const findShortestPath = (passcode: string) =>
  $(
    loopUntil(
      (_, states) => $(states, map(whereGo(passcode)), flatten()),
      s => s.length == 0 || $(s, some(reachedTheExit)),
      [{ x: 0, y: 0, path: '' }]
    ),
    find(reachedTheExit),
    pluck('path')
  )

console.log('Part 1:', findShortestPath('yjjvjgan'))

const findLongestPath = (passcode: string) =>
  $(
    loopUntil(
      (_, [states, doneStates]) => [
        $(states, filter(not(reachedTheExit)), map(whereGo(passcode)), flatten()),
        $(doneStates, push($(states, filter(reachedTheExit))))
      ],
      ([s]) => s.length == 0,
      [[{ x: 0, y: 0, path: '' }], []]
    ),
    last,
    map(pipe(pluck('path'), length)),
    max
  )

console.log('Part 2:', findLongestPath('yjjvjgan'))
