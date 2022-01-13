import { $, allEqual, is, loopUntil, map, mod, mult, pipe, pluck, repeat, substr, toString } from '../../common'

const genA = (n: number) => $(n, mult(16807), mod(2147483647))
const genB = (n: number) => $(n, mult(48271), mod(2147483647))

const match = (n1: number, n2: number) => $([n1, n2], map(pipe(toString(2), substr(-16))), allEqual)

type State = { a: number; b: number; matches: number }
const step = ({ a, b, matches }: State): State =>
  $([genA(a), genB(b)], ([a, b]) => ({ a, b, matches: matches + (match(a, b) ? 1 : 0) }))

console.log('Part 1:', $({ a: 699, b: 124, matches: 0 }, repeat(40000000, step), pluck('matches')))

const genA2 = (n: number) => loopUntil((_, n) => genA(n), pipe(mod(4), is(0)), n)
const genB2 = (n: number) => loopUntil((_, n) => genB(n), pipe(mod(8), is(0)), n)

const step2 = ({ a, b, matches }: State): State =>
  $([genA2(a), genB2(b)], ([a, b]) => ({ a, b, matches: matches + (match(a, b) ? 1 : 0) }))

console.log('Part 2:', $({ a: 699, b: 124, matches: 0 }, repeat(5000000, step2), pluck('matches')))
