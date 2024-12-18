import { $, pluck, readInput } from '../../common'
import { parseAndRun } from '../assembunny'

const input = readInput()

console.log('Part 1:', $(input, parseAndRun(), pluck('a')))

console.log('Part 2:', $(input, parseAndRun({ c: 1 }), pluck('a')))
