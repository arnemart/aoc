import {
  $,
  fillArray,
  filter,
  flatten,
  lines,
  loopUntil,
  map,
  nonNull,
  pluck,
  readInput,
  reduce,
  setIn,
  split
} from '../../common'

type SC = { x: number; y: number; sc: string }
type Grid = SC[][]

const seacucumbers: Grid = $(
  readInput(),
  lines,
  map((line, y) =>
    $(
      line,
      split(),
      map((sc, x) => (sc == '.' ? null : { x, y, sc }))
    )
  )
)

const H = seacucumbers.length
const W = seacucumbers[0].length

const organize = (scs: SC[]): Grid =>
  $(
    scs,
    filter(nonNull),
    reduce((grid, sc) => $(grid, setIn([sc.y, sc.x], sc)), fillArray([W, H]))
  )

const move = (dir: string) => (scs: Grid) =>
  $(
    scs,
    flatten(),
    filter(nonNull),
    map(
      dir == '>'
        ? ({ x, y, sc }) => (sc == '>' ? { sc, y, x: scs[y][(x + 1) % W] == null ? (x + 1) % W : x } : { sc, x, y })
        : ({ x, y, sc }) => (sc == 'v' ? { sc, x, y: scs[(y + 1) % H][x] == null ? (y + 1) % H : y } : { sc, x, y })
    ),
    organize
  )

const findSteadyState = (scs: Grid) =>
  $(
    loopUntil(
      (_, { steps, state }) => ({
        prevState: JSON.stringify(state),
        state: $(state, move('>'), move('v')),
        steps: steps + 1
      }),
      ({ state, prevState }) => JSON.stringify(state) == prevState,
      { state: scs, prevState: '', steps: 0 }
    ),
    pluck('steps')
  )

console.log('Part 1:', $(seacucumbers, findSteadyState))
