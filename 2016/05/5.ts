import { $, filter, int, is, isNull, join, length, loopUntil, lt, match, md5, not } from '../../common'

const input = 'reyedfim'

const pwreg = /^00000(\w)(\w)/
const passwords = loopUntil(
  (i, pws) =>
    $(`${input}${i}`, md5, match(pwreg), matches => {
      if (matches) {
        if (pws[0].length < 8) {
          pws[0] = pws[0] + matches[1]
        }
        if ($(pws[1], filter(not(isNull)), length, lt(8))) {
          const n = int(matches[1])
          if (n < 8 && !pws[1][n]) {
            pws[1][n] = matches[2]
          }
        }
      }
      return pws
    }),
  pws => $(pws[0], length, is(8)) && $(pws[1], filter(not(isNull)), length, is(8)),
  ['', []] as [string, string[]]
)

console.log('Part 1:', passwords[0])
console.log('Part 2:', $(passwords[1], join()))
