import { $, first, ints, map, pipe, readInput, sortNumeric, slice, split, sum } from '../../common'

const elves = $(readInput(), split('\n\n'), map(pipe(split('\n'), ints, sum)), sortNumeric({ reverse: true }))

console.log('Part 1:', $(elves, first))
console.log('Part 2:', $(elves, slice(0, 3), sum))
