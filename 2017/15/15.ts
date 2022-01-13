import { $, allEqual, is, loopUntil, map, mod, mult, pipe, pluck, repeat } from '../../common'

const sixteenBits = Math.pow(2, 16)

const genA1 = (n: number) => $(n, mult(16807), mod(2147483647))
const genB1 = (n: number) => $(n, mult(48271), mod(2147483647))

const match = (n1: number, n2: number) => $([n1, n2], map(mod(sixteenBits)), allEqual)

type State = { a: number; b: number; matches: number }
const step =
  (genA: (n: number) => number, genB: (n: number) => number) =>
  ({ a, b, matches }: State): State =>
    $([genA(a), genB(b)], ([a, b]) => ({ a, b, matches: matches + (match(a, b) ? 1 : 0) }))

const initialState = { a: 699, b: 124, matches: 0 }

console.log('Part 1:', $(initialState, repeat(40000000, step(genA1, genB1)), pluck('matches')))

const genA2 = (n: number) => loopUntil((_, n) => genA1(n), pipe(mod(4), is(0)), n)
const genB2 = (n: number) => loopUntil((_, n) => genB1(n), pipe(mod(8), is(0)), n)

console.log('Part 2:', $(initialState, repeat(5000000, step(genA2, genB2)), pluck('matches')))
