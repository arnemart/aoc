import {
  $,
  allEqual,
  and,
  cond,
  count,
  every,
  filter,
  find,
  first,
  flatten,
  id,
  is,
  isIn,
  length,
  lines,
  loopUntil,
  map,
  not,
  or,
  pipe,
  readInput,
  some,
  split,
  tee,
  test,
  unique
} from '../../common'

const connections = $(
  readInput(
    `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
    false
  ),
  lines,
  map(split('-'))
)

const whereGo = (smallCaveFilter: (cs: string[]) => (c: string) => boolean) => (path: string[]) => {
  return $(
    connections,
    filter(and(some(is($(path, first))))),
    map(find(not(is($(path, first))))),
    filter(or(bigCave, smallCaveFilter(path)))
  )
}

const goOneStep = (smallCaveFilter: (cs: string[]) => (c: string) => boolean) =>
  pipe(
    map((path: string[]) =>
      $(
        path,
        hasEnded,
        cond(
          [[true, [path]]],
          $(
            path,
            whereGo(smallCaveFilter),
            map(c => [c, ...path])
          )
        )
      )
    ),
    flatten()
  )

const bigCave = test(/[A-Z]/)
const weCanVisitSmallCavesOnce = (whereHaveWeAlreadyBeen: string[]) => not(isIn(whereHaveWeAlreadyBeen))

const hasEnded = pipe(first, is('end'))

const countPaths = (smallCaveFilter: (cs: string[]) => (c: string) => boolean) =>
  $(
    loopUntil((_, paths) => $(paths, goOneStep(smallCaveFilter)), every(hasEnded), [['start']]),
    length
  )

console.log('Part 1:', countPaths(weCanVisitSmallCavesOnce))

const noDuplicateSmallCave = pipe(filter(not(bigCave)), tee(id, unique), map(length), allEqual)

const weCanVisitSmallCavesTwice = (path: string[]) => (cave: string) =>
  $(
    path,
    count(is(cave)),
    or(
      is(0),
      and(
        is(1),
        () => $(cave, not(is('start', 'end'))),
        () => $(path, noDuplicateSmallCave)
      )
    )
  )

console.log('Part 2:', countPaths(weCanVisitSmallCavesTwice))
