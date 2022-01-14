import {
  $,
  arrEqual,
  cond,
  filter,
  first,
  flatmap,
  flatten,
  ints,
  is,
  last,
  length,
  lines,
  map,
  max,
  not,
  or,
  pipe,
  readInput,
  reverse,
  some,
  sortNumeric,
  split,
  sum
} from '../../common'

type Comp = number[]
type Bridge = Comp[]

const allComps: Comp[] = $(readInput(), lines, map(pipe(split('/'), ints)))
const comps = (withoutThese: Comp[]) =>
  $(allComps, filter(not(c => $(withoutThese, some(or(arrEqual(c), arrEqual(reverse(c))))))))

const matches = (bridge: Bridge): Comp[] =>
  $(bridge, last, last, v =>
    $(
      comps(bridge),
      filter(some(is(v))),
      map(c =>
        $(
          c,
          first,
          is(v),
          cond([[true, () => c]], () => $(c, reverse))
        )
      )
    )
  )

const buildBridges = (bridges: Bridge[]): Bridge[] =>
  $(
    bridges,
    flatmap(bridge =>
      $(bridge, matches, m =>
        $(
          m,
          length,
          cond([[0, () => [bridge]]], () =>
            $(
              m,
              map(c => [...bridge, c]),
              buildBridges
            )
          )
        )
      )
    )
  )

const allBridges = $(
  allComps,
  filter(pipe(first, is(0))),
  map(c => [c]),
  buildBridges
)

console.log('Part 1:', $(allBridges, map(pipe(flatten(), sum)), max))

console.log(
  'Part 2:',
  $(
    allBridges,
    filter(pipe(length, is($(allBridges, map(length), sortNumeric(), last)))),
    map(pipe(flatten(), sum)),
    max
  )
)
