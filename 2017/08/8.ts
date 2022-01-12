import { $, filter, last, map, max, nonNull, parse, readInput, values } from '../../common'

const registers: Record<string, number> = {}
const get = (r: string) => registers[r] || 0
const set = (r: string, v: number) => (registers[r] = v)

const program = $(
  readInput(),
  parse(
    /^(\w+) (inc|dec) (-?\d+) if (\w+) (\S+) (-?\d+)$/,
    ([_, r1, op, v1, r2, cond, v2]) =>
      `if (get('${r2}') ${cond} ${v2}) { set('${r1}', get('${r1}') ${op == 'inc' ? '+' : '-'} ${v1})}`
  )
)

const maxes = $(
  program,
  map(line => {
    eval(line)
    return $(registers, values, max)
  }),
  filter(nonNull)
)

console.log('Part 1:', $(maxes, last))
console.log('Part 2:', $(maxes, max))
