import { $, ints, map, pipe, readInput, sortNumeric, slice, split, sum, last } from '../../common'

const elves = $(readInput(), split('\n\n'), map(pipe(split('\n'), ints, sum)), sortNumeric())

console.log('Part 1:', $(elves, last))
console.log('Part 2:', $(elves, slice(-3), sum))
