import { $, loopUntil, md5, test } from '../../common'

const secretKey = 'yzbqklnj'

const solve = (match: RegExp) =>
  loopUntil(i => {
    if ($(md5(`${secretKey}${i}`), test(match))) {
      return i
    }
  })

console.log('Part 1:', solve(/^00000/))
console.log('Part 2:', solve(/^000000/))
