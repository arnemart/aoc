import { $, pluck, readInput } from '../../common'
import { parseAndRun } from '../assembunny'

const input = readInput()

console.log('Part 1:', $(input, parseAndRun({ a: 7 }), pluck('a')))

// Welcome to brute force zone
console.log('Part 2:', $(input, parseAndRun({ a: 12 }), pluck('a')))
