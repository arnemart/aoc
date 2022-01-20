import {
  $,
  add,
  cond,
  difference,
  join,
  last,
  lines,
  map,
  mult,
  pipe,
  pluckFrom,
  range,
  readInput,
  reduce,
  repeat,
  replace,
  slice,
  split,
  substr,
  sum,
  unroll
} from '../../common'

const [startingPots, patterns] = $(
  readInput(),
  split('\n\n'),
  unroll(replace('initial state: ', ''), pipe(lines, map(split(' => ')), Object.fromEntries))
)

const step = (plants: string) =>
  $('....' + plants + '....', p2 =>
    $(
      range(0, p2.length - 4),
      map(i => $(p2, substr(i, i + 5), pluckFrom(patterns, '.'))),
      join()
    )
  )

const sumPots = (n: number) => (pots: string) =>
  $(
    pots,
    split(),
    map((plant, i) => $(plant, cond([['#', i - n * 2]], 0))),
    sum
  )

console.log('Part 1:', $(startingPots, repeat(20, step), sumPots(20)))

const afterAWhile = $(
  range(101),
  reduce(
    ({ sums, pots }, i) => ({
      pots: step(pots),
      sums: [...sums, $(pots, sumPots(i))]
    }),
    { sums: [], pots: startingPots }
  )
).sums

console.log('Part 2:', $(afterAWhile, last, add($(afterAWhile, slice(-2), difference, mult(50000000000 - 100)))))
