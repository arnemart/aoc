import { $, mod, mult, pipe, range, repeat, sum } from '../../common'

const row = 2978
const col = 3083

const num = (row: number, col: number) => ((row - 1) * row) / 2 + 1 + $(range(row + 1, row + col), sum)

const code = (n: number) => $(20151125, repeat(n - 1, pipe(mult(252533), mod(33554393))))

console.log('Part 1:', $(num(row, col), code))
