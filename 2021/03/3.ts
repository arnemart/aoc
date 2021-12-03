import {
  $,
  cond,
  filter,
  first,
  ints,
  is,
  join,
  length,
  lines,
  loopUntil,
  map,
  number,
  pipe,
  pluck,
  product,
  readInput,
  split,
  sum,
  zip
} from '../../common'

type Input = number[][]

const input: Input = $(readInput(), lines, map(pipe(split(), ints)))

const count = (nums: Input) => $(nums, zip, map(sum))

const part1 = (input: Input) => (vals: number[]) =>
  $(
    count(input),
    map(c => (c > $(input, length) / 2 ? vals[0] : vals[1])),
    join(),
    number(2)
  )

const solve = (partSolver: (input: Input) => (vals: number[]) => number) => (input: Input) =>
  $(
    [
      [1, 0],
      [0, 1]
    ],
    map(partSolver(input)),
    product
  )

console.log('Part 1:', $(input, solve(part1)))

const part2 = (input: Input) => (values: number[]) =>
  $(
    loopUntil(
      (bit, numbers) =>
        $(
          numbers,
          filter(num =>
            $(
              numbers,
              count,
              pluck(bit),
              cond(
                [[n => n >= $(numbers, length) / 2, $(num, pluck(bit), is(values[0]))]],
                $(num, pluck(bit), is(values[1]))
              )
            )
          )
        ),
      pipe(length, is(1)),
      input
    ),
    first,
    join(),
    number(2)
  )

console.log('Part 1:', $(input, solve(part2)))
