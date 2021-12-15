import { $, loopUntil, match, md5, repeat } from '../../common'

const tripletReg = /(\w)\1\1/

const seenHashes = new Map<string, string>()
const getHash = (str: string, hashFn: (s: string) => string) => {
  if (!seenHashes.has(str)) {
    seenHashes.set(str, hashFn(str))
  }
  return seenHashes.get(str)
}

const doTheHashing3 = (str: string, hashFn: (s: string) => string) => {
  seenHashes.clear()
  return loopUntil(
    (i, [_, found]) => {
      const tripletMatches = $(getHash(`${str}${i}`, hashFn), match(tripletReg))
      if (tripletMatches) {
        const quintupletReg = new RegExp(`(${tripletMatches[1]})\\1\\1\\1\\1`)
        const hasQuintuplet = loopUntil(j =>
          j > 1000 ? false : quintupletReg.test(getHash(`${str}${i + j + 1}`, hashFn)) ? true : null
        )
        if (hasQuintuplet == true) {
          return [i, found + 1]
        }
      }
      return [i, found]
    },
    ([_, found]) => found == 64,
    [0, 0]
  )[0]
}

console.log('Part 1:', doTheHashing3('qzyelonm', md5))
console.log('Part 2:', doTheHashing3('qzyelonm', repeat(2017, md5)))
