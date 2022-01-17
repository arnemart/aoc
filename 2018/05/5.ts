import { $, flatmap, join, length, letters, loopUntil, map, min, not, pipe, readInput, replace, test } from '../../common'

const startingPolymer = readInput()

const pattern = new RegExp(
  $(
    letters,
    flatmap(l => [l + l.toUpperCase(), l.toUpperCase() + l]),
    join('|')
  ),
  'g'
)

const react = (polymer: string) => loopUntil((_, p) => $(p, replace(pattern, '')), not(test(pattern)), polymer)

console.log('Part 1:', $(startingPolymer, react, length))

const collapsedPolymers = $(
  letters,
  map(
    pipe(
      l => new RegExp(l, 'gi'),
      p => $(startingPolymer, replace(p, '')),
      react
    )
  )
)

console.log('Part 2:', $(collapsedPolymers, map(length), min))
