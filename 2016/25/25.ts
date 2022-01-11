import { $, id, join, loopUntil, pluck, readInput, test } from '../../common'
import { parseAndRun } from '../assembunny'

const input = readInput()

const is0101010etc = (n: number) => $(input, parseAndRun({ a: n }, 50000), pluck('output'), join(), test(/^(01)+0?$/))

console.log('Part 1:', loopUntil(id, is0101010etc))
