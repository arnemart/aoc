import { $, filter, join, length, map, match, pipe, readInput, split, test } from '../../common'

const inputParts = $(readInput(), split(/\n\n/))

const input = $(inputParts[1], split(/\n/))

type Rules = Map<string, string>
const rules: Rules = $(
  inputParts[0],
  split(/\n/),
  map(match(/^(\d+): (.+)$/)),
  map(([_, n, rule]) => [n, rule] as [string, string]),
  r => new Map(r)
)

const buildReg = (r: string, startedWith: string = r, seen = new Map<string, number>()): string => {
  seen.set(r, seen.has(r) ? seen.get(r) + 1 : 1)
  if (r == startedWith && seen.get(r) > 10) return ''

  const rule = rules.get(r)
  const recur = pipe(
    split(/\s+/),
    map((s: string) => buildReg(s, startedWith, seen)),
    join()
  )

  if (/^"\w+"$/.test(rule)) {
    return rule.slice(1, -1)
  } else if (/\|/.test(rule)) {
    return $(rule, split(/\s*\|\s*/), map(recur), join('|'), s => `(${s})`)
  } else {
    return $(rule, recur)
  }
}

const regex = (rules: Rules) =>
  $(
    rules.get('0'),
    split(/\s/),
    map(s => buildReg(s)),
    join(),
    s => new RegExp(`^${s}$`)
  )

const reg1 = regex(rules)

console.log('Part 1:', $(input, filter(test(reg1)), length))

const reg2 = regex(rules.set('8', '42 | 42 8').set('11', '42 31 | 42 11 31'))

console.log('Part 2:', $(input, filter(test(reg2)), length))
