import { $, join, leastCommon, lines, map, mostCommon, readInput, split, zip } from '../../common'

const input = $(readInput(), lines, map(split()), zip)

console.log('Part 1:', $(input, map(mostCommon), join()))
console.log('Part 2:', $(input, map(leastCommon), join()))
