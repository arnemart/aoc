import {
  $,
  allIndexesOf,
  first,
  flatten,
  last,
  length,
  lines,
  map,
  pipe,
  readInput,
  replaceIndex,
  reverse,
  sort,
  split,
  tee,
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

const step = (molecule: string) =>
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

console.log('Part 1:', $(molecule, step, length))

const reverseReplacements = $(replacements, map(reverse))

console.log('Part 2: no way jose')
