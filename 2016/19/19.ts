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

const aStupidImplementationOfASlightlyMoreSensibleGame = (elves: number[]) => {
  while (elves.length > 1) {
    elves.splice(Math.floor((elves.length / 2) % elves.length), 1)
    elves.push(elves[0])
    elves.splice(0, 1)
  }
  return elves[0]
}

console.log('Part 2:', aStupidImplementationOfASlightlyMoreSensibleGame(elves))
