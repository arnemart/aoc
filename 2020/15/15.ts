import { $, readInput, last, ints, pluck, range, reduce, slice, split } from '../../common'

const input = $(readInput(), split(/,/), ints)

const getFinalNumber = (nth: number, input: number[]) =>
  $(
    range(input.length, nth),
    reduce(
      ({ mp, num }, turn) => ({
        num: turn - mp.get(num) || 0,
        mp: mp.set(num, turn)
      }),
      {
        num: $(input, last),
        mp: $(
          input,
          slice(0, -1),
          reduce((m, p, n) => m.set(p, n + 1), new Map<number, number>())
        )
      }
    ),
    pluck('num')
  )

console.log('Part 1:', getFinalNumber(2020, input))
console.log('Part 2:', getFinalNumber(30000000, input))
