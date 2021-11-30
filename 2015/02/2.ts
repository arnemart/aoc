import { $, ints, lines, map, min, readInput, slice, sortNumeric, split, sum } from '../../common'

const input = $(readInput(), lines, map(split('x')), map(ints))

const area = ([w, h, l]: number[]): number => {
  const s1 = l * w
  const s2 = w * h
  const s3 = h * l
  return 2 * s1 + 2 * s2 + 2 * s3 + $([s1, s2, s3], min)
}

console.log('Part 1:', $(input, map(area), sum))

const ribbon = ([w, h, l]: number[]): number => $([w, h, l], sortNumeric(), slice(0, 2), sum) * 2 + w * h * l

console.log('Part 2:', $(input, map(ribbon), sum))
