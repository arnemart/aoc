import { $, abs, add, ints, length, map, median, min, pipe, range, readInput, split, subtract, sum } from '../../common'

const crabs = $(readInput(), split(','), ints)
const medianCrab = $(crabs, median)
const crabCount = $(crabs, length)

console.log('Part 1:', $(crabs, map(pipe(subtract(medianCrab), abs)), sum))

const fuelCost = (crabs: number[]) => (pos: number) => $(crabs, map(pipe(subtract(pos), abs, add(1), range, sum)), sum)

console.log('Part 2:', $(range(medianCrab - crabCount / 4, medianCrab + crabCount / 4), map(fuelCost(crabs)), min))
