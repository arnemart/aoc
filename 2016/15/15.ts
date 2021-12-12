import { $, every, id, ints, loopUntil, parse, pipe, readInput, slice } from '../../common'

const discs = $(readInput(), parse(/has (\d+) .+ (\d+)\.$/, pipe(slice(1, 3), ints)))

const discsAreAligned = (discs: number[][]) => (time: number) =>
  $(
    discs,
    every((disc, i) => (i + time + 1 + disc[1]) % disc[0] == 0)
  )

console.log('Part 1:', loopUntil(id, discsAreAligned(discs)))

console.log('Part 2:', loopUntil(id, discsAreAligned([...discs, [11, 0]])))
