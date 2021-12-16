import {
  $,
  add,
  cond,
  filter,
  findIndex,
  first,
  ints,
  is,
  last,
  length,
  lines,
  loopUntil,
  map,
  not,
  pipe,
  pluck,
  readInput,
  repeat,
  slice,
  some,
  sortBy,
  split,
  sum,
  tee,
  zip
} from '../../common'

const mergeOverlaps = (rules: number[][]) =>
  $(
    loopUntil(
      (_, { rules, oldRules: [rule, ...oldRules] }) =>
        $(
          oldRules,
          findIndex(([a]) => a <= rule[1] + 1),
          overlap =>
            $(
              overlap,
              cond([[-1, () => ({ rules: [...rules, rule], oldRules })]], () => ({
                rules: [...rules, [rule[0], oldRules[overlap][1]]],
                oldRules: [...$(oldRules, slice(0, overlap)), ...$(oldRules, slice(overlap + 1))]
              }))
            )
        ),
      pipe(pluck('oldRules'), length, is(0)),
      { oldRules: rules, rules: [] as number[][] }
    ),
    pluck('rules')
  )

const rules = $(
  readInput(),
  lines,
  map(pipe(split('-'), ints)),
  sortBy(first),
  filter(([a, b], i, arr) => $(arr, not(some(([a2, b2], i2) => i != i2 && a2 <= a && b2 >= b)))),
  repeat(5, mergeOverlaps)
)

console.log('Part 1:', $(rules, first, last, add(1)))

console.log(
  'Part 2:',
  $(
    rules,
    tee(slice(0, -1), slice(1)),
    zip,
    map(([a, b]) => b[0] - a[1] - 1),
    sum
  )
)
