import { $, chop, count, flatten, ints, lines, map, pipe, readInput, sortNumeric, split, trim, zip } from '../../common'

const triangles = $(readInput(), lines, map(pipe(trim, split(/\s+/), ints)))

const countPossible = (triangles: number[][]): number =>
  $(triangles, count(pipe(sortNumeric({ reverse: true }), ([s1, s2, s3]) => s1 < s2 + s3)))

console.log('Part 1:', $(triangles, countPossible))

console.log('Part 2:', $(triangles, zip, flatten(), chop(3), countPossible))
