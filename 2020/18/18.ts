import { $, ints, lines, map, pipe, readInput, replace, sum } from '../../common'

const input = $(readInput(), lines)

const parenReg = /\(([^()]+)\)/
const calcReg = /^\d+\s*(\+|\*)\s*\d+/
const plusReg = /\d+\s*\+\s*\d+/

const calculateFromLeft = (line: string): string =>
  calcReg.test(line) ? calculateFromLeft($(line, replace(calcReg, eval))) : line

const replaceParens =
  (calcFn: (s: string) => string) =>
  (line: string): string =>
    parenReg.test(line)
      ? replaceParens(calcFn)(
          $(
            line,
            replace(parenReg, (_, match) => calcFn(match))
          )
        )
      : calcFn(line)

const part1 = pipe(map(replaceParens(calculateFromLeft)), ints, sum)

console.log('Part 1:', $(input, part1))

const calculatePlusFirst = (line: string): string =>
  plusReg.test(line) ? calculatePlusFirst(line.replace(plusReg, eval)) : line

const part2 = pipe(map(replaceParens(pipe(calculatePlusFirst, calculateFromLeft))), ints, sum)

console.log('Part 2:', $(input, part2))
