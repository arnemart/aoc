import { $, ints, lines, loopUntil, nonNull, pipe, pluck, readInput, sum } from '../../common'

const changes = $(readInput(), lines, ints)

console.log('Part 1:', $(changes, sum))

console.log(
  'Part 2:',
  $(
    loopUntil(
      (i, { sum, sums }) =>
        $(sum + changes[i % changes.length], newSum =>
          $(sums.set(newSum, (sums.get(newSum) || 0) + 1), newSums => ({
            sum: newSum,
            sums: newSums,
            found: newSums.get(newSum) > 1 ? newSum : null
          }))
        ),
      pipe(pluck('found'), nonNull),
      { sum: 0, sums: new Map<number, number>([[0, 1]]), found: null }
    ),
    pluck('found')
  )
)
