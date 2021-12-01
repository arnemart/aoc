import { $, length, lines, map, pipe, readInput, sum } from '../../common'

const input = $(readInput(), lines)

console.log('Part 1:', $(input, map(length), sum) - $(input, map(pipe(eval, length)), sum))

console.log('Part 1:', $(input, map(pipe(JSON.stringify, length)), sum) - $(input, map(length), sum))
