import { $, chars, filter, lines, map, pluck, readInput, reduce } from '../../common'

const input = $(readInput(), lines, map(chars), map(map(c => c == '#')))

const checkSlope = (right: number, down: number) =>
  $(
    input,
    filter((_, y) => y % down == 0),
    reduce(
      (state, line) => ({
        count: state.count + Number(line[state.x]),
        x: (state.x + right) % line.length
      }),
      {
        count: 0,
        x: 0
      }
    ),
    pluck('count')
  )

console.log('Part 1:', checkSlope(3, 1))

console.log('Part 2:', checkSlope(1, 1) * checkSlope(3, 1) * checkSlope(5, 1) * checkSlope(7, 1) * checkSlope(1, 2))
