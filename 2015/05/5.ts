import { $, filter, length, lines, map, readInput } from '../../common'
const input = $(readInput(), lines)

const part1niceRegex1 = /[aeiou].*[aeiou].*[aeiou]/
const part1niceRegex2 = /(.)\1/
const part1naughtyRegex = /ab|cd|pq|xy/

const part1isNice = (s: string) => part1niceRegex1.test(s) && part1niceRegex2.test(s) && !part1naughtyRegex.test(s)

console.log('Part 1:', $(input, map(part1isNice), filter(Boolean), length))

const part2niceRegex1 = /(..).*\1/
const part2niceRegex2 = /(.).\1/

const part2isNice = (s: string) => part2niceRegex1.test(s) && part2niceRegex2.test(s)

console.log('Part 2:', $(input, map(part2isNice), filter(Boolean), length))
