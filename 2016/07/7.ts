import {
  $,
  and,
  count,
  every,
  first,
  is,
  lines,
  map,
  matchAll,
  matchAllOverlapping,
  not,
  pipe,
  readInput,
  replace,
  some
} from '../../common'

const addresses = $(readInput(), lines)

const hasNonMatching = (reg: RegExp) => (s: string) =>
  $(
    s,
    matchAllOverlapping(reg),
    some(m => (m ? m[1] != m[2] : false))
  )

const hasAbba = hasNonMatching(/(\w)(\w)\2\1/)

const bracketReg = /\[\w+?\]/g
const bracketedParts = pipe(matchAll(bracketReg), map(first))

const supportsTLS = pipe(and(hasAbba, pipe(bracketedParts, every(not(hasAbba)))))

console.log('Part 1:', $(addresses, map(supportsTLS), count(is(true))))

const withoutBracketedParts = replace(bracketReg, '|')

const abaReg = /(\w)(\w)\1/
const hasAba = hasNonMatching(abaReg)
const babFinders = pipe(
  matchAllOverlapping(abaReg),
  map(([_, a, b]) => hasNonMatching(new RegExp(`(${b})(${a})${b}`)))
)

const supportsSSL = (s: string) =>
  $(
    s,
    withoutBracketedParts,
    and(
      hasAba,
      pipe(
        babFinders,
        some(babFinder => $(s, bracketedParts, some(babFinder)))
      )
    )
  )

console.log('Part 2:', $(addresses, count(supportsSSL)))
