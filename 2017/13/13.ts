import { $, id, ints, lines, loopUntil, map, not, pipe, readInput, some, split, sum } from '../../common'

const firewall = $(readInput(), lines, map(pipe(split(': '), ints)))

const severity = (start: number) =>
  $(
    firewall,
    map(([l, d]) => ((l + start) % ((d - 1) * 2) == 0 ? l * d : 0)),
    sum
  )

console.log('Part 1:', severity(0))

const caught = (start: number) =>
  $(
    firewall,
    some(([l, d]) => (l + start) % ((d - 1) * 2) == 0)
  )

console.log('Part 2:', loopUntil(id, not(caught)))
