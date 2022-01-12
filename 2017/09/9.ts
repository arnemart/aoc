import { $, join, length, map, matchAll, nth, readInput, replace, split } from '../../common'

const inputWithoutCancelledCharacters = $(readInput(), replace(/\!./g, ''))
const inputWithoutGarbage = $(inputWithoutCancelledCharacters, replace(/\<[^\>]*\>/g, ''), replace(/,/g, ''), split())

const calculateScore = ([first, ...rest]: string[], score = 0, depth = 0) =>
  first == '{'
    ? calculateScore(rest, score, depth + 1)
    : first == '}'
    ? calculateScore(rest, score + depth, depth - 1)
    : score

console.log('Part 1:', $(inputWithoutGarbage, calculateScore))

console.log('Part 2:', $(inputWithoutCancelledCharacters, matchAll(/\<([^\>]*)\>/g), map(nth(1)), join(), length))
