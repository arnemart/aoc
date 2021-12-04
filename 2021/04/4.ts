import {
  $,
  every,
  filter,
  find,
  first,
  flatten,
  getIn,
  includes,
  ints,
  is,
  isNull,
  last,
  length,
  lines,
  loopUntil,
  map,
  not,
  pipe,
  product,
  range,
  readInput,
  reduce,
  slice,
  split,
  sum,
  tee,
  trim,
  without
} from '../../common'

type Row = number[]
type Board = Row[]

const [numbers, boards]: [number[], Board[]] = $(
  readInput(),
  split(/\n\n/),
  tee(pipe(first, split(','), ints), pipe(slice(1), map(pipe(lines, map(pipe(trim, split(/\s+/), ints))))))
)

const rowsCols = $(
  range(5),
  tee(
    $(
      map(y =>
        $(
          range(5),
          map(x => [y, x])
        )
      )
    ),
    $(
      map(x =>
        $(
          range(5),
          map(y => [y, x])
        )
      )
    )
  ),
  flatten()
)

const getRowsCols = (board: Board): Row[] => $(board, b => $(rowsCols, map(map(c => $(b, getIn(...c))))))

const score = ([board, nums]) =>
  $(
    nums,
    reduce((b, n) => $(b, without(n)), $(board, flatten())),
    sum,
    s => $([s, $(nums, last)], product)
  )

const findMatchingRow =
  (nums: number[]) =>
  (board: Board): [Board, number[]] =>
    $(board, getRowsCols, find(every(n => $(nums, includes(n))))) ? [board, nums] : null

const findFirstWinningBoard = (boards: Board[]) =>
  loopUntil(i => $(boards, map(findMatchingRow(numbers.slice(0, i))), find(not(isNull))))

console.log('Part 1:', $(boards, findFirstWinningBoard, score))

const findLastWinningBoard = (boards: Board[]) =>
  loopUntil(i => $(boards, filter(pipe(findMatchingRow(numbers.slice(0, i)), isNull))), pipe(length, is(1)))

console.log('Part 2:', $(boards, findLastWinningBoard, findFirstWinningBoard, score))
