import { $, chars, cond, count, flatten, getIn, is, join, lines, map, readInput } from '../../common'

type Seat = 'L' | '#' | '.'
type SeatMap = Seat[][]

const seatMap = $(readInput(), lines, map(chars)) as SeatMap

const dirs = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
]

type CountAdjFn = (seats: SeatMap, x: number, y: number) => number

const countAdj1: CountAdjFn = (seats, x, y) =>
  $(
    dirs,
    map(([dx, dy]) => $(seats, getIn(y + dy, x + dx))),
    count(is('#'))
  )

const findInDirection = (seats: SeatMap, x: number, y: number, [dx, dy]: number[]): boolean =>
  $(
    seats,
    getIn(y + dy, x + dx),
    cond(
      [
        ['#', true],
        ['.', () => findInDirection(seats, x + dx, y + dy, [dx, dy])]
      ],
      false
    )
  )

const countAdj2: CountAdjFn = (seats, x, y) =>
  $(
    dirs,
    map(d => findInDirection(seats, x, y, d)),
    count(s => s)
  )

const step =
  (n: number, countAdjFn: CountAdjFn) =>
  (seats: SeatMap): SeatMap =>
    $(
      seats,
      map((row, y) =>
        $(
          row,
          map(
            (seat, x) =>
              $(
                seat,
                cond([
                  ['.', '.'],
                  ['L', countAdjFn(seats, x, y) == 0 ? '#' : 'L'],
                  ['#', countAdjFn(seats, x, y) >= n ? 'L' : '#']
                ])
              ) as Seat
          )
        )
      )
    )

const equal = (s1: SeatMap, s2: SeatMap) => $(s1, map(join()), join()) == $(s2, map(join()), join())

const stepUntilEqual =
  (stepFn: (s: SeatMap) => SeatMap) =>
  (seats: SeatMap): SeatMap => {
    const newSeats = stepFn(seats)
    if (equal(seats, newSeats)) {
      return seats
    } else {
      return stepUntilEqual(stepFn)(newSeats)
    }
  }

const countOccupied = (seats: SeatMap): number => $(seats, flatten(), count(is('#')))

const step1fn = step(4, countAdj1)
const step2fn = step(5, countAdj2)

console.log('Part 1:', $(seatMap, stepUntilEqual(step1fn), countOccupied))
console.log('Part 2:', $(seatMap, stepUntilEqual(step2fn), countOccupied))
