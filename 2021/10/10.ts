import {
  $,
  filter,
  first,
  is,
  last,
  length,
  lines,
  map,
  median,
  not,
  pipe,
  pluck,
  push,
  readInput,
  reduce,
  reverse,
  slice,
  split,
  sum,
  values
} from '../../common'

const input = $(readInput(), lines, map(split()))

const matching = { ')': '(', ']': '[', '}': '{', '>': '<' }
const starts = $(matching, values)

type Result = { valid: boolean; unclosed?: string[]; firstIncorrect?: string }

const validate = (line: string[], stack: string[] = []): Result => {
  if ($(line, length, is(0))) {
    return {
      valid: true,
      unclosed: stack
    }
  } else {
    const firstChar = $(line, first)
    const rest = $(line, slice(1))
    if ($(firstChar, is(...starts))) {
      return validate(rest, $(stack, push(firstChar)))
    } else if ($(stack, last, is(matching[firstChar]))) {
      return validate(rest, $(stack, slice(0, -1)))
    } else {
      return {
        valid: false,
        firstIncorrect: firstChar
      }
    }
  }
}

const illegalScores = { ')': 3, ']': 57, '}': 1197, '>': 25137 }

const validated = $(
  input,
  map(s => validate(s))
)

console.log(
  'Part 1:',
  $(
    validated,
    filter(not(pluck('valid'))),
    map(s => illegalScores[s.firstIncorrect]),
    sum
  )
)

const unclosedScores = { '(': 1, '[': 2, '{': 3, '<': 4 }

console.log(
  'Part 2:',
  $(
    validated,
    filter(pluck('valid')),
    map(
      pipe(
        pluck('unclosed'),
        reverse,
        reduce((score, s) => score * 5 + unclosedScores[s], 0)
      )
    ),
    median
  )
)
