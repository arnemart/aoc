import { $, loopUntil, test } from '../../common'
import crypto = require('crypto')
const hash = (val: string) => crypto.createHash('md5').update(val).digest('hex')

const secretKey = 'yzbqklnj'

const solve = (match: RegExp) =>
  loopUntil(i => {
    if ($(hash(`${secretKey}${i}`), test(match))) {
      return i
    }
  })

console.log('Part 1:', solve(/^00000/))
console.log('Part 2:', solve(/^000000/))
