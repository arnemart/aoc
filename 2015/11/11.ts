import {
  $,
  add,
  charAt,
  filter,
  indexOf,
  join,
  length,
  letters,
  loopUntil,
  map,
  match,
  mod,
  not,
  setIn,
  slice,
  some,
  split,
  test,
  zipWith
} from '../../common'

const input = 'cqjxjnds'

const incrementLetter = (letter: string) => letters[$(letters, indexOf(letter), add(1), mod($(letters, length)))]
const incrementString = (str: string, which: number = -1) => {
  if (which == -1) {
    which = str.length - 1
  }
  const newLetter = $(str, charAt(which), incrementLetter)
  const newStr = $(str, split(), setIn([which], newLetter), join())
  if (newLetter == 'a') {
    return incrementString(newStr, which - 1)
  } else {
    return newStr
  }
}

const invalidLetters = /i|l|o/
const validLetters = not(test(invalidLetters))

const validRuns = $(
  $(letters, slice(0, -2), zipWith($(letters, slice(1, -1)), $(letters, slice(2))), map(join())),
  filter(not(test(invalidLetters))),
  map(s => new RegExp(s))
)
const hasRun = (pw: string): boolean =>
  $(
    validRuns,
    some(run => test(run)(pw))
  )

const twoPairs = /((.)\2).*((.)\4)/
const hasTwoPairs = (pw: string): boolean => $(pw, match(twoPairs), matches => matches && matches[1] != matches[3])

const valid = (pw: string) => $(pw, validLetters) && $(pw, hasTwoPairs) && $(pw, hasRun)

const findNextPw = (pw: string) => loopUntil((_, result) => incrementString(result), valid, pw)

const pw1 = findNextPw(input)
console.log('Part 1:', pw1)

const pw2 = findNextPw(pw1)
console.log('Part 2:', pw2)
