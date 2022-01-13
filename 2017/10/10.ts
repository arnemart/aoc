import { $, ints, product, readInput, slice, split } from '../../common'
import { getSkipSizes, knothash, run } from './knothash'

const inputLengths = $(readInput(), split(','), ints)

console.log('Part 1:', $(inputLengths, getSkipSizes, run, slice(0, 2), product))

console.log('Part 2:', $(readInput(), knothash))
