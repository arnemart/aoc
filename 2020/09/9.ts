import { $, find, findWithContext, ints, lines, readInput, slice, sum } from '../../common'

const input = $(readInput(), lines, ints)

const notASum = $(
  input,
  slice(25),
  find((num, i) => {
    const prev25 = $(input, slice(i, i + 25))
    return !$(
      prev25,
      find(
        (n, i) =>
          !!$(
            prev25,
            slice(i + 1),
            find(n2 => n + n2 == num)
          )
      )
    )
  })
)

const findRange = (list: number[], i: number, sumToFind: number, length = 1): number[] => {
  const range = $(list, slice(i, i + length))
  const rsum = $(range, sum)
  if (rsum < sumToFind) {
    return findRange(list, i, sumToFind, length + 1)
  } else if (rsum == sumToFind) {
    return range
  }
  return []
}

const rangeThatSums = $(
  input,
  findWithContext((_, i) => {
    const range = findRange(input, i, notASum)
    return [range.length > 0, range]
  })
)[1]

console.log('Part 1:', notASum)

console.log('Part 2:', Math.min(...rangeThatSums) + Math.max(...rangeThatSums))
