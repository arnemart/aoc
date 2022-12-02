import { $, getInFrom, map, readInput, split, sum } from '../../common'

const scores1 = {
  A: { X: 4, Y: 8, Z: 3 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 7, Y: 2, Z: 6 }
}

const scores2 = {
  A: { X: 3, Y: 4, Z: 8 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 2, Y: 6, Z: 7 }
}

const strategy = $(readInput(), split('\n'), map(split(' ')))

console.log('Part 1:', $(strategy, map(getInFrom(scores1)), sum))
console.log('Part 2:', $(strategy, map(getInFrom(scores2)), sum))
