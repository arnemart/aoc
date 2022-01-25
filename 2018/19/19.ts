import {
  $,
  first,
  int,
  lines,
  slice,
  match,
  nth,
  pipe,
  readInput,
  tee,
  map,
  spy,
  set,
  cond,
  loopUntil,
  pluck,
  gt,
  add
} from '../../common'

type Op = { op: string; A: number; B: number; C: number }

const [ip, program]: [number, Op[]] = $(
  readInput(),
  lines,
  tee(
    pipe(first, match(/(\d)/), nth(1), int),
    pipe(
      slice(1),
      map(pipe(match(/(\w+) (\d+) (\d+) (\d+)/), ([_, op, a, b, c]) => ({ op, A: int(a), B: int(b), C: int(c) })))
    )
  )
)

const step = (reg: number[]): number[] =>
  $(program[reg[ip]], ({ op, A, B, C }) =>
    $(
      reg,
      set(
        C,
        $(
          op,
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
      ),
      set(ip, add(1))
    )
  )

const runProgram = (initialState: number[]) =>
  loopUntil(
    (_, reg) => step(reg),
    reg => reg[ip] < 0 || reg[ip] >= program.length,
    initialState
  )

console.log('Part 1:', runProgram([0, 0, 0, 0, 0, 0])[0])

console.log('Part 2:', runProgram([1, 0, 0, 0, 0, 0])[0])
