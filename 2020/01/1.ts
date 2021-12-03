import { $, combinations, find, ints, is, lines, pipe, product, readInput, sum } from '../../common'

const input = $(readInput(), lines, ints)

const part1: (a: number[]) => number = pipe(combinations(2), find(pipe(sum, is(2020))), product)
const part2: (a: number[]) => number = pipe(combinations(3), find(pipe(sum, is(2020))), product)

console.log('Part 1:', $(input, part1))
console.log('Part 2:', $(input, part2))
