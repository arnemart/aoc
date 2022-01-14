import {
  $,
  chop,
  cond,
  count,
  fillArray,
  find,
  flatmap,
  flatten,
  id,
  is,
  join,
  length,
  map,
  mod,
  parse,
  pipe,
  pluck,
  pluckFrom,
  readInput,
  repeat,
  reverse,
  split,
  sqrt,
  tee,
  zip
} from '../../common'

type Square = string[][]

const replacements: Record<string, Square> = $(
  readInput(),
  parse(/^(.+) => (.+)$/, ([_, a, b]) => $([a, $(b, split('/'), map(split()))])),
  Object.fromEntries
)

const rotateAndFlip: (s: Square) => Square[] = pipe(
  tee(id, map(reverse)),
  flatmap(s => [s, $(s, zip, map(reverse)), $(s, map(reverse), reverse), $(s, zip, reverse)] as Square[])
)

const divide = (s: Square): Square[] =>
  $(
    s,
    length,
    mod(2),
    cond([[0, 2]], 3),
    n =>
      $(s, map(chop(n)), chop(n), chopped =>
        $(fillArray([chopped.length, chopped.length], (y, x) => $(chopped[y], map(pluck(x)))))
      ),
    flatten()
  )

const findReplacement = (s: Square): Square =>
  $(
    s,
    rotateAndFlip,
    map(pipe(map(join()), join('/'))),
    find(str => str in replacements),
    pluckFrom(replacements)
  )

const conquer = (ss: Square[]) =>
  $(ss, length, sqrt, n => $(ss, chop(n), map(pipe(zip, map(flatten()))), flatten())) as Square

const step = pipe(divide, map(findReplacement), conquer)

const countOn = (s: Square) => $(s, flatten(), count(is('#')))

const initialImage: Square = $('.#./..#/###', split('/'), map(split()))

const after5steps = $(initialImage, repeat(5, step))

console.log('Part 1:', $(after5steps, countOn))

const after18steps = $(after5steps, repeat(13, step))

console.log('Part 2:', $(after18steps, countOn))
