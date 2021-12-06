import { $, add, frequencies, get, ints, range, readInput, reduce, repeat, set, split, sum, values } from '../../common'

type Fishes = Map<number, number>
const fishes: Fishes = $(readInput(), split(','), ints, frequencies)

const step = (fishes: Fishes): Fishes =>
  $(
    range(8),
    reduce((newFishes, n) => $(newFishes, set(n, $(fishes, get(n + 1, 0)))), new Map<number, number>()),
    set(6, (n: number) => $(fishes, get(0, 0), add(n ?? 0))),
    set(8, $(fishes, get(0, 0)))
  )

console.log('Part 1:', $(fishes, repeat(80, step), values, sum))

console.log('Part 2:', $(fishes, repeat(256, step), values, sum))
