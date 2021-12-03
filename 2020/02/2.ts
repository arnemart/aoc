import { $, chars, count, lines, map, match, readInput, within, xor } from '../../common'

interface Pw {
  min: number
  max: number
  letter: string
  pw: string
}

const pwreg = /^(\d+)-(\d+) (\w): (\w+)$/

const valid1 = ({ pw, min, max, letter }: Pw) =>
  $(
    pw,
    chars,
    count(l => l == letter),
    within(min, max)
  )

const valid2 = ({ pw, min, max, letter }: Pw) => xor(pw.charAt(min - 1) == letter, pw.charAt(max - 1) == letter)

const input: Pw[] = $(
  readInput(),
  lines,
  map(match(pwreg)),
  map(([_, min, max, letter, pw]) => ({
    min: parseInt(min),
    max: parseInt(max),
    letter,
    pw
  }))
)

console.log('Part 1:', $(input, count(valid1)))

console.log('Part 2:', $(input, count(valid2)))
