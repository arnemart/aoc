import {
  $,
  add,
  filter,
  first,
  floor,
  gte,
  id,
  is,
  loopUntil,
  mod,
  mult,
  pipe,
  range,
  reduce,
  sqrt,
  sum,
  tee,
  values
} from '../../common'

const input = 29000000
const divisors = (n: number) =>
  $(
    range(1, $(n, sqrt, add(1), floor)),
    filter(d => $(n, mod(d), is(0))),
    reduce((fs, f) => fs.add(f).add($(n / f, floor)), new Set<number>()),
    fs => fs.add(n),
    values
  )

const countPresents = (fn = divisors, n = 10) => pipe(fn, sum, mult(n))

const part1result = $(
  loopUntil(tee(id, countPresents()), ([_, p]) => $(p, gte(input)), null, 1),
  first
)

console.log('Part 1:', part1result)

const divisorsUpTo50 = (n: number) =>
  $(
    n,
    divisors,
    filter(f => f * 50 >= n)
  )

console.log(
  'Part 2:',
  $(
    loopUntil(tee(id, countPresents(divisorsUpTo50, 11)), ([_, p]) => $(p, gte(input)), null, part1result),
    first
  )
)
