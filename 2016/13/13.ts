import {
  $,
  and,
  count,
  every,
  filter,
  find,
  first,
  flatten,
  gte,
  inclusiveRange,
  is,
  join,
  length,
  loopUntil,
  map,
  not,
  odd,
  repeat,
  some,
  split,
  subtract,
  toString,
  unique
} from '../../common'

type C = number[]
type Path = C[]

const isWall = ([x, y]: C) => $(x * x + 3 * x + 2 * x * y + y + y * y + 1352, toString(2), split(), count(is('1')), odd)

const whereToGoFromHere = ([[x, y], ...path]: Path): C[] =>
  $(
    [
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
      [x, y - 1]
    ] as C[],
    filter(and(every(gte(0)), not(isWall), ([x, y]) => $(path, not(some(([px, py]) => px == x && py == y)))))
  )

const justOneStepFurther = (paths: Path[]): Path[] =>
  $(
    paths,
    map(path =>
      $(
        path,
        whereToGoFromHere,
        map(c => [c, ...path])
      )
    ),
    flatten()
  )

const goesTo = (to: C) => (path: Path) => $(path, first, ([x, y]) => x == to[0] && y == to[1])

const findPath = (from: C, to: C) =>
  $(
    loopUntil((_, paths) => $(paths, justOneStepFurther), some(goesTo(to)), [[from]]),
    find(goesTo(to))
  )

console.log('Part 1:', $(findPath([1, 1], [31, 39]), length, subtract(1)))

console.log(
  'Part 2:',
  $(
    inclusiveRange(1, 50),
    map(n => $([[[1, 1]]], repeat(n, justOneStepFurther))),
    flatten(2),
    map(join(',')),
    unique,
    length
  )
)
