import {
  $,
  allIndexesOf,
  cond,
  first,
  flatten,
  includes,
  is,
  join,
  last,
  length,
  lines,
  loopUntil,
  map,
  match,
  not,
  pipe,
  readInput,
  reduce,
  replace,
  replaceIndex,
  sort,
  split,
  substr,
  tee,
  test,
  unique
} from '../../common'

const [replacements, molecule] = $(
  readInput(),
  split(/\n\n/),
  tee(
    pipe(
      first,
      lines,
      map(split(' => ')),
      sort((a, b) => $(b, last, length) - $(a, last, length))
    ),
    last
  )
)

const findReplacements = (molecule: string) =>
  $(
    replacements,
    map(([pattern, replacement]) =>
      $(
        molecule,
        allIndexesOf(pattern),
        map(i => $(molecule, replaceIndex(i, $(pattern, length), replacement)))
      )
    ),
    flatten(),
    unique
  )

console.log('Part 1:', $(molecule, findReplacements, length))

const insertParens = (s: string) => $(s, replace(/Rn/g, '('), replace(/Ar/g, ')'))

const reverseReplacements = $(replacements, map(tee(pipe(last, insertParens), first)))

const replaceAllAndCount = (s: string, count: number): [string, number] =>
  $(
    reverseReplacements,
    reduce(
      ([s, count], [key, value]) =>
        $(
          s.includes(key),
          cond([
            [true, [s.replace(key, value), count + 1]],
            [false, [s, count]]
          ])
        ),
      [s, count]
    )
  )

const partRegex = /[A-Z][a-z]?(Ca)?\([^(]+?\)/
const replacePart = (molecule: string, count: number): [string, number] =>
  $(molecule, match(partRegex), matches => {
    const [s, currentCount] = loopUntil(
      (_, [s, count]) => replaceAllAndCount(s, count),
      ([s]) => $(reverseReplacements, map(last), includes(s)),
      [matches[0], count]
    )
    return [
      $([$(molecule, substr(0, matches.index)), s, $(molecule, substr(matches.index + matches[0].length))], join()),
      currentCount
    ]
  })

const [moleculeWithPartsReplaced, countSoFar] = loopUntil(
  (_, [s, count]) => replacePart(s, count),
  ([s]) => $(s, not(test(partRegex))),
  [$(molecule, insertParens), 0]
)

const [_, finalCount] = loopUntil(
  (_, [s, count]) => replaceAllAndCount(s, count),
  ([s]) => $(s, is('e')),
  [moleculeWithPartsReplaced, countSoFar]
)

console.log('Part 2:', finalCount)
