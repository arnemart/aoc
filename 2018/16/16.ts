import {
  $,
  clone,
  cond,
  count,
  every,
  fillArray,
  filter,
  first,
  gte,
  ints,
  is,
  isIn,
  length,
  lines,
  loopUntil,
  map,
  not,
  parse,
  pipe,
  readInput,
  reduce,
  set,
  slice,
  split,
  unroll
} from '../../common'

type Sample = { inp: number[]; op: number[]; out: number[] }
const [samples, program] = $(
  readInput(),
  split('\n\n\n\n'),
  unroll(
    pipe(
      split('\n\n'),
      map(pipe(parse(/(\d+)\D+(\d+)\D+(\d+)\D+(\d+)/, pipe(slice(1, 5), ints)), ([inp, op, out]) => ({ inp, op, out })))
    ),
    pipe(lines, map(pipe(split(' '), ints)))
  )
) as [Sample[], number[][]]

const canBe =
  ({ inp, op: [_, A, B, C], out }: Sample) =>
  (opcode: string) =>
    $(
      opcode,
      cond([
        ['addr', () => out[C] == inp[A] + inp[B]],
        ['addi', () => out[C] == inp[A] + B],
        ['mulr', () => out[C] == inp[A] * inp[B]],
        ['muli', () => out[C] == inp[A] * B],
        ['banr', () => out[C] == (inp[A] & inp[B])],
        ['bani', () => out[C] == (inp[A] & B)],
        ['borr', () => out[C] == (inp[A] | inp[B])],
        ['bori', () => out[C] == (inp[A] | B)],
        ['setr', () => out[C] == inp[A]],
        ['seti', () => out[C] == A],
        ['gtir', () => (out[C] == 1 && A > inp[B]) || (out[C] == 0 && A <= inp[B])],
        ['gtri', () => (out[C] == 1 && inp[A] > B) || (out[C] == 0 && inp[A] <= B)],
        ['gtrr', () => (out[C] == 1 && inp[A] > inp[B]) || (out[C] == 0 && inp[A] <= inp[B])],
        ['eqir', () => (out[C] == 1 && A == inp[B]) || (out[C] == 0 && A != inp[B])],
        ['eqri', () => (out[C] == 1 && inp[A] == B) || (out[C] == 0 && inp[A] != B)],
        ['eqrr', () => (out[C] == 1 && inp[A] == inp[B]) || (out[C] == 0 && inp[A] != inp[B])]
      ])
    )

const startingOpCodes: string[][] = fillArray(16, [
  'addr',
  'addi',
  'mulr',
  'muli',
  'banr',
  'bani',
  'borr',
  'bori',
  'setr',
  'seti',
  'gtir',
  'gtri',
  'gtrr',
  'eqir',
  'eqri',
  'eqrr'
])

const eliminate = (opCodes: string[][], sample: Sample): String[][] =>
  $(opCodes, set(sample.op[0], filter(canBe(sample))))

console.log(
  'Part 1:',
  $(
    samples,
    map(sample => eliminate(clone(startingOpCodes), sample)[sample.op[0]]),
    count(pipe(length, gte(3)))
  )
)

const opCodes = $(
  loopUntil(
    (_, ops) =>
      $(
        ops,
        map(op => (op.length == 1 ? op : $(op, filter(not(isIn($(ops, filter(pipe(length, is(1))), map(first))))))))
      ),
    every(pipe(length, is(1))),
    $(samples, reduce(eliminate, startingOpCodes))
  ),
  map(first)
)

const step = (reg: number[], [op, A, B, C]: number[]) =>
  $(
    reg,
    set(
      C,
      $(
        opCodes[op],
        cond([
          ['addr', reg[A] + reg[B]],
          ['addi', reg[A] + B],
          ['mulr', reg[A] * reg[B]],
          ['muli', reg[A] * B],
          ['banr', reg[A] & reg[B]],
          ['bani', reg[A] & B],
          ['borr', reg[A] | reg[B]],
          ['bori', reg[A] | B],
          ['setr', reg[A]],
          ['seti', A],
          ['gtir', A > reg[B] ? 1 : 0],
          ['gtri', reg[A] > B ? 1 : 0],
          ['gtrr', reg[A] > reg[B] ? 1 : 0],
          ['eqir', A == reg[B] ? 1 : 0],
          ['eqri', reg[A] == B ? 1 : 0],
          ['eqrr', reg[A] == reg[B] ? 1 : 0]
        ])
      )
    )
  )

const result = $(program, reduce(step, [0, 0, 0, 0]))

console.log('Part 1:', result[0])
