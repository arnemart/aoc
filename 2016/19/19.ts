import { $, even, filter, first, inclusiveRange, is, length, loopUntil, odd, pipe, shift } from '../../common'

const elves = inclusiveRange(1, 3005290)

const aPoorlyDesignedGame = (elves: number[]) =>
  $(
    loopUntil(
      (_, e) =>
        $(
          e,
          filter((_, i) => even(i)),
          shift($(e, length, odd) ? 1 : 0)
        ),
      pipe(length, is(1)),
      elves
    ),
    first
  )

console.log('Part 1:', aPoorlyDesignedGame(elves))

/*




































































Welcome to the hot garbage zone

*/

const thisIsStupid = (elves: number[]) => {
  while (elves.length > 1) {
    let i = 0
    let toRemove = Math.floor(elves.length / 2) + i
    while (elves.length > toRemove) {
      elves.splice(toRemove, 1)
      i++
      toRemove = Math.floor(elves.length / 2) + i
    }
    elves = $(elves, shift(-i))
  }
  return elves[0]
}

console.log('Part 2:', thisIsStupid(elves))
