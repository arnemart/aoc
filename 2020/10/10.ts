import { $, ints, last, lines, map, product, readInput, reduce, sortNumeric, zipWith } from '../../common'

const inputJoltages = $(readInput(), lines, ints, sortNumeric())
const joltages = [...inputJoltages, $(inputJoltages, last) + 3]

const { ones, threes, runs } = $(
  joltages,
  zipWith([0, ...joltages]),
  map(([j, p]) => j - p),
  reduce(
    ({ ones, threes, runs, currentRun }, diff) => ({
      ones: diff == 1 ? ones + 1 : ones,
      threes: diff == 3 ? threes + 1 : threes,
      runs: diff > 1 && currentRun > 1 ? [...runs, currentRun + 1] : runs,
      currentRun: diff == 1 ? currentRun + 1 : 0
    }),
    { ones: 0, threes: 0, runs: [] as number[], currentRun: 0 }
  )
)

const validPermutations = $(
  runs,
  map(n => Math.pow(2, n - 2) - (n >= 5 ? 1 : 0)),
  product
)

console.log('Part 1:', ones * threes)
console.log('Part 2:', validPermutations)
