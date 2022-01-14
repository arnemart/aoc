import {
  $,
  abs,
  cond,
  filter,
  find,
  gte,
  indexOf,
  int,
  length,
  map,
  match,
  next,
  pipe,
  pluck,
  range,
  readInput,
  reduce,
  reverse,
  split,
  sum
} from '../../common'

type Direction = {
  dir: 'R' | 'L'
  dist: number
}

const directions = $(
  readInput(),
  split(', '),
  map(pipe(match(/^(R|L)(\d+)$/), ([_, dir, dist]) => ({ dir, dist: $(dist, int) })))
) as Direction[]

const cardinalDirections = ['N', 'E', 'S', 'W']

type State = {
  x: number
  y: number
  pointing: string
  trail: number[][]
}

const dirDeltas = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
}

const step = (state: State, { dir, dist }: Direction): State =>
  $(cardinalDirections, next(state.pointing, $(dir, cond([['R', 1]], -1))), pointing => {
    const newX = state.x + dist * dirDeltas[pointing][0]
    const newY = state.y + dist * dirDeltas[pointing][1]
    const newTrail =
      state.x == newX
        ? newY > state.y
          ? $(
              range(state.y, newY),
              map(y => [newX, y])
            )
          : $(
              range(newY + 1, state.y + 1),
              reverse,
              map(y => [newX, y])
            )
        : newX > state.x
        ? $(
            range(state.x, newX),
            map(x => [x, newY])
          )
        : $(
            range(newX + 1, state.x + 1),
            reverse,
            map(x => [x, newY])
          )
    return {
      x: newX,
      y: newY,
      pointing: pointing,
      trail: [...state.trail, ...newTrail]
    }
  })

const initialState: State = { x: 0, y: 0, pointing: 'N', trail: [] }
const endState = $(directions, reduce(step, initialState))

console.log('Part 1:', $(endState, pluck(['x', 'y']), map(abs), sum))

console.log(
  'Part 2:',
  $(
    endState,
    pluck('trail'),
    find(([x1, y1], i, trail) =>
      $(
        trail,
        filter(([x2, y2], j) => i != j && x1 == x2 && y1 == y2),
        length,
        gte(1)
      )
    ),
    map(abs),
    sum
  )
)
