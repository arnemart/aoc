import { $, clamp, join, lines, map, pluck, readInput, reduce, split } from '../../common'

const instructions = $(readInput(), lines, map(split()))

const deltas = {
  U: [0, -1],
  D: [0, 1],
  R: [1, 0],
  L: [-1, 0]
}

const keypad = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
]

type State = {
  code: string[]
  x: number
  y: number
}

const stayOnTheKeypad = clamp(0, 2)

const digit = (state: State, directions: string[]): State =>
  $(
    directions,
    reduce(
      ([x, y], dir) => [stayOnTheKeypad(x + deltas[dir][0]), stayOnTheKeypad(y + deltas[dir][1])],
      $(state, pluck(['x', 'y']))
    ),
    ([x, y]) => ({ code: [...state.code, keypad[y][x]], x, y })
  )

console.log('Part 1:', $(instructions, reduce(digit, { code: [], x: 1, y: 1 }), pluck('code'), join()))

const actualKeypad = [
  [null, null, '1', null, null],
  [null, '2', '3', '4', null],
  ['5', '6', '7', '8', '9'],
  [null, 'A', 'B', 'C', null],
  [null, null, 'D', null, null]
]

const navigateTheGodDamnKeypad = ([x, y]: number[], dir: string): [number, number] => {
  const newX = x + deltas[dir][0]
  const newY = y + deltas[dir][1]
  return actualKeypad[newY]?.[newX] ? [newX, newY] : [x, y]
}

const actualDigit = (state: State, directions: string[]): State =>
  $(directions, reduce(navigateTheGodDamnKeypad, $(state, pluck(['x', 'y']))), ([x, y]) => ({
    code: [...state.code, actualKeypad[y][x]],
    x,
    y
  }))

console.log('Part 1:', $(instructions, reduce(actualDigit, { code: [], x: 0, y: 2 }), pluck('code'), join()))
