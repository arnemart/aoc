import {
  $,
  cond,
  first,
  groupBy,
  gt,
  ife,
  is,
  isIn,
  join,
  last,
  length,
  lines,
  loopUntil,
  map,
  mapEntries,
  next,
  partition,
  pipe,
  pluck,
  readInput,
  reduce,
  some,
  sortBy,
  split,
  unroll
} from '../../common'

type Tracks = string[][]
type Cart = { x: number; y: number; dir: 'v' | '<' | '^' | '>'; turn: -1 | 0 | 1 }
const turns = [-1, 0, 1]
const dirs = ['v', '<', '^', '>']
const deltas = { v: [1, 0], '<': [0, -1], '^': [-1, 0], '>': [0, 1] }

const { tracks, carts } = $(
  readInput(),
  lines,
  map(split()),
  reduce(
    ({ tracks, carts }, row, y) =>
      $(
        row,
        reduce(
          ({ row, rowCarts }, v, x) =>
            $(
              v,
              isIn(dirs),
              ife(
                () => ({ row: [...row, v], rowCarts: [...rowCarts, { x, y, dir: v, turn: -1 } as Cart] }),
                () => ({ row: [...row, v], rowCarts })
              )
            ),
          { row: [] as string[], rowCarts: [] as Cart[] }
        ),
        ({ row, rowCarts }) => ({ tracks: [...tracks, row], carts: [...carts, ...rowCarts] })
      ),
    { tracks: [] as Tracks, carts: [] as Cart[] }
  )
)

const step = (carts: Cart[]): Cart[] =>
  $(
    carts,
    sortBy(({ y, x }) => y * 1000 + x),
    reduce(
      (carts, { y, x, dir, turn }, i) => [
        ...carts,
        $(
          carts,
          some(({ y: cy, x: cx }, j) => i != j && y == cy && x == cx),
          ife(
            // Someone has crashed into us
            { y, x, dir, turn },
            // Track is clear (for now)
            () =>
              $([y + deltas[dir][0], x + deltas[dir][1]], ([y, x]) => ({
                y,
                x,
                dir: $(
                  tracks[y][x],
                  cond(
                    [
                      ['+', () => $(dir, next(dirs, turn))],
                      ['/', () => $(dir, next(dirs, $(dir, cond([[['^', 'v'], 1]], -1))))],
                      ['\\', () => $(dir, next(dirs, $(dir, cond([[['^', 'v'], -1]], 1))))]
                    ],
                    dir
                  )
                ),
                turn: $(tracks[y][x], cond([['+', () => $(turn, next(turns))]], turn))
              }))
          )
        )
      ],
      []
    )
  )

const findCrashes = (carts: Cart[]): [number[][], Cart[]] =>
  $(
    carts,
    groupBy(pipe(pluck(['y', 'x']), join(','))),
    mapEntries,
    partition(pipe(last, length, gt(1))),
    unroll(
      map(([_, [{ y, x }]]) => [x, y]),
      map(pipe(last, first))
    )
  )

const inTheEnd = loopUntil(
  (_, { carts, crashes }) =>
    $(carts, step, findCrashes, ([newCrashes, carts]) => ({
      carts,
      crashes: [...crashes, ...newCrashes]
    })),
  pipe(pluck('carts'), length, is(1)),
  { carts, crashes: [] as number[][] }
)

console.log('Part 1:', $(inTheEnd.crashes[0], join(',')))

console.log('Part 2:', $(inTheEnd.carts[0], pluck(['x', 'y']), join(',')))
