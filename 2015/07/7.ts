import { $, cond, forEach, int, keys, lines, map, match, pipe, readInput, reduce, spyWith } from '../../common'

type ConnType = 'VAL' | 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT' | 'NOT'
type Conn = {
  type: ConnType
  out: string
  val: string
  op1: string
  op2: string
  memo?: number
}

const connectionRegex = /^((?<op1>\w+) )?((?<type>AND|OR|LSHIFT|RSHIFT|NOT) (?<op2>\w+) )?-> (?<out>\w+)$/

const input = $(
  readInput(),
  lines,
  map(
    pipe(
      match(connectionRegex),
      matches =>
        ({
          type: matches.groups.type || 'VAL',
          out: matches.groups.out,
          op1: matches.groups.op1,
          op2: matches.groups.op2
        } as Conn)
    )
  ),
  reduce((conns, conn) => {
    conns[conn.out] = conn
    return conns
  }, {} as { [key: string]: Conn })
)

const numberRegex = /^\d+/
const isNumber = (s: string) => numberRegex.test(s)
const sixteenbit = (val: number): number => (val < 0 ? 65536 + val : val) % 65536

const findValue = (wire: string): number => {
  return isNumber(wire)
    ? $(wire, int)
    : input[wire].memo ??
        $(
          input[wire].type,
          cond([
            ['VAL', () => findValue(input[wire].op1)],
            ['AND', () => sixteenbit(findValue(input[wire].op1) & findValue(input[wire].op2))],
            ['OR', () => sixteenbit(findValue(input[wire].op1) | findValue(input[wire].op2))],
            ['NOT', () => sixteenbit(~findValue(input[wire].op2))],
            ['LSHIFT', () => sixteenbit(findValue(input[wire].op1) << findValue(input[wire].op2))],
            ['RSHIFT', () => sixteenbit(findValue(input[wire].op1) >> findValue(input[wire].op2))]
          ]),
          val => (input[wire].memo = val)
        )
}

const wireA = findValue('a')
console.log('Part 1:', wireA)

input['b'] = {
  ...input['b'],
  type: 'VAL',
  op1: wireA.toString()
}

$(
  input,
  keys,
  forEach(key => (input[key].memo = undefined))
)

console.log('Part 2:', findValue('a'))
