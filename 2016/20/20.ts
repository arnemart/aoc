import {
  $,
  filter,
  findIndex,
  id,
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
  some,
  split,
  within
} from '../../common'

const mergeOverlaps = (rules: number[][]) =>
  $(
    loopUntil(
      (_, { rules, oldRules: [rule, ...oldRules] }) => {
        const overlapLeft = $(
          oldRules,
          findIndex(([a, b]) => a < rule[0] && b + 1 >= rule[0] && b < rule[1])
        )
        const overlapRight = $(
          oldRules,
          findIndex(([a, b]) => rule[0] < a && rule[1] + 1 >= a && b > rule[1])
        )
        if (overlapLeft > -1) {
          rules.push([oldRules[overlapLeft][0], rule[1]])
          oldRules.splice(overlapLeft, 1)
          return { rules, oldRules }
        } else if (overlapRight > -1) {
          rules.push([rule[0], oldRules[overlapRight][1]])
          oldRules.splice(overlapRight, 1)
          return { rules, oldRules }
        } else {
          rules.push(rule)
          return { rules, oldRules }
        }
      },
      pipe(pluck('oldRules'), length, is(0)),
      { oldRules: rules, rules: [] as number[][] }
    ),
    pluck('rules')
  )

const rules = $(
  readInput(
    `10-20
21-30`,
    false
  ),
  lines,
  map(pipe(split('-'), ints)),
  // Filter out completely overlapping rules
  filter(([a, b], i, arr) => $(arr, not(some(([a2, b2], i2) => i != i2 && a2 <= a && b2 >= b)))),
  // Merge together partially overlapping rules
  repeat(5, mergeOverlaps)
)

const ipFilters = $(
  rules,
  map(([a, b]) => within(a, b))
)

const checkIp = (ip: number) => $(ipFilters, not(some(f => f(ip))))

console.log('Part 1:', loopUntil(id, checkIp))

// Better go make a cup of coffee or something
console.log(
  'Part 2:',
  $(
    loopUntil(
      (i, result) => [i, result[1] + (checkIp(i) ? 1 : 0)],
      ([i]) => i == 4294967295,
      [0, 0]
    ),
    last
  )
)
