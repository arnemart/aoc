import { $, filter, map, pluck, readInput, reduce, split, union } from '../../common'

const input = $(readInput(), split())

const xDelta = { '<': -1, '>': 1, v: 0, '^': 0 }
const yDelta = { '<': 0, '>': 0, v: 1, '^': -1 }

const countHouses = (dirs: string[]) =>
  $(
    dirs,
    reduce(
      (state, d: string) => {
        const x = state.x + xDelta[d]
        const y = state.y + yDelta[d]
        return {
          houses: state.houses.add(`${x}x${y}`),
          x,
          y
        }
      },
      { houses: new Set<string>(['0x0']), x: 0, y: 0 }
    ),
    pluck('houses')
  )

console.log('Part 1:', $(input, countHouses, pluck('size')))

const santaInput = $(
  input,
  filter((d, i) => i % 2 == 0)
)
const robotinput = $(
  input,
  filter((d, i) => i % 2 == 1)
)

console.log('Part 2:', $([santaInput, robotinput], map(countHouses), union, pluck('size')))
