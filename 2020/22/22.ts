import {
  $,
  ints,
  join,
  map,
  pipe,
  pluck,
  product,
  range,
  readInput,
  reverse,
  slice,
  split,
  sum,
  zipWith
} from '../../common'

type Deck = number[]
type Decks = Deck[]

const decks: Decks = $(readInput(), split(/\n\n/), map(pipe(split(/\n/), slice(1), ints)))

const playRound = ([d1, d2]: Decks): Decks =>
  d1[0] > d2[0]
    ? [[...$(d1, slice(1)), d1[0], d2[0]], $(d2, slice(1))]
    : [$(d1, slice(1)), [...$(d2, slice(1)), d2[0], d1[0]]]

const play = ([d1, d2]: Decks): number[] =>
  d1.length == 0 || d2.length == 0 ? [score(d1), score(d2)] : play(playRound([d1, d2]))

const score = (deck: Deck): number => $(deck, reverse, zipWith(range(1, deck.length + 1)), map(product), sum)

console.log(
  'Part 1:',
  $(decks, play, scores => Math.max(...scores))
)

const roundToString = pipe(map(join(',')), join('-'))

const playRecursive = ([d1, d2]: Decks, prevRounds = new Set<string>()): [boolean, Decks] => {
  if (d1.length == 0 || d2.length == 0) {
    return [false, [d1, d2]]
  }

  const roundString = roundToString([d1, d2])
  if (prevRounds.has(roundString)) {
    return [true, [d1, d2]]
  }
  prevRounds.add(roundString)

  if (d1.length > d1[0] && d2.length > d2[0]) {
    const [p1won, decks] = playRecursive([$(d1, slice(1, d1[0] + 1)), $(d2, slice(1, d2[0] + 1))])
    if (p1won || decks[1].length == 0) {
      return playRecursive([[...$(d1, slice(1)), d1[0], d2[0]], $(d2, slice(1))], prevRounds)
    } else {
      return playRecursive([$(d1, slice(1)), [...$(d2, slice(1)), d2[0], d1[0]]], prevRounds)
    }
  } else {
    return playRecursive(playRound([d1, d2]), prevRounds)
  }
}

// npx tsc 22.ts && node --stack-size=10000 22.js
console.log(
  'Part 2:',
  $(decks, playRecursive, pluck(1), map(score), scores => Math.max(...scores))
)
