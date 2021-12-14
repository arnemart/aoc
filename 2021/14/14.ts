import {
  $,
  first,
  frequencies,
  join,
  last,
  map,
  mapEntries,
  parse,
  pipe,
  pluck,
  readInput,
  reduce,
  repeat,
  set,
  slice,
  sort,
  split,
  substr,
  tee,
  values,
  zipWith
} from '../../common'

type Pairs = Map<string, number>
const [lastChar, pairs, rules]: [string, Pairs, Record<string, string>] = $(
  readInput(),
  split('\n\n'),
  tee(
    pipe(first, split(), last),
    pipe(first, split(), tpl => $(tpl, slice(0, -1), zipWith($(tpl, slice(1))), map(join()), frequencies)),
    pipe(last, parse(/^(\w\w) -> (\w)$/, pluck([1, 2])), Object.fromEntries)
  )
)

const safeAdd = (n: number | undefined) => (n2: number | undefined) => (n || 0) + (n2 || 0)

const step = (pairs: Pairs): Pairs =>
  $(
    pairs,
    mapEntries,
    reduce((pairs, [pair, count]) => {
      const [p1, p2] = $(pair, split(), ([a, b]) => [a + rules[pair], rules[pair] + b])
      return $(pairs, set(p1, safeAdd(count)), set(p2, safeAdd(count)))
    }, new Map<string, number>())
  )

const score = (pairs: Pairs) =>
  $(
    pairs,
    mapEntries,
    reduce(
      (counts, [pair, count]) => $(counts, set($(pair, substr(0, 1)), safeAdd(count))),
      new Map<string, number>([[lastChar, 1]])
    ),
    values,
    sort((a, b) => a - b),
    tee(first, last),
    ([a, b]) => b - a
  )

const polymer = (steps: number) => (pairs: Pairs) => $(pairs, repeat(steps, step), score)

console.log('Step 1:', $(pairs, polymer(10)))

console.log('Step 2:', $(pairs, polymer(40)))
