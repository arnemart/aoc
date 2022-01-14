import { $, cond, int, loopUntil, numeric, parse, readInput, sqrt } from '../../common'

type Cmd = { cmd: string; v1: string | number; v2: string | number }

const program: Cmd[] = $(
  readInput(),
  parse(/^(\w+) (\w+)( (-?\w+))?$/, ([_, cmd, v1, __, v2]) => ({
    cmd,
    v1: numeric(v1) ? int(v1) : v1,
    v2: numeric(v2) ? int(v2) : v2
  }))
)

type State = {
  prog: Cmd[]
  pc: number
  reg: Record<string, number>
  mulCount: number
}

const v = (state: State, what: string | number) => (numeric(what) ? what : state.reg[what] || 0) as number

const step = (state: State): State =>
  $(state.prog[state.pc], cmd =>
    $(
      cmd?.cmd,
      cond([
        ['set', () => ({ ...state, pc: state.pc + 1, reg: { ...state.reg, [cmd.v1]: v(state, cmd.v2) } })],
        [
          'sub',
          () => ({
            ...state,
            pc: state.pc + 1,
            reg: { ...state.reg, [cmd.v1]: v(state, cmd.v1) - v(state, cmd.v2) }
          })
        ],
        [
          'mul',
          () => ({
            ...state,
            pc: state.pc + 1,
            mulCount: state.mulCount + 1,
            reg: { ...state.reg, [cmd.v1]: v(state, cmd.v1) * v(state, cmd.v2) }
          })
        ],
        ['jnz', () => ({ ...state, pc: state.pc + (v(state, cmd.v1) == 0 ? 1 : v(state, cmd.v2)) })]
      ])
    )
  )

console.log(
  'Part 1:',
  loopUntil(
    (_, state) => step(state),
    ({ pc, prog }) => pc >= prog.length,
    {
      prog: program,
      pc: 0,
      reg: {},
      mulCount: 0
    }
  ).mulCount
)

let b = 81 * 100 + 100000
let c = b + 17000
let h = 0
while (true) {
  outer: for (let d = 2; d <= sqrt(b); d++) {
    for (let e = 2; e <= b / 2; e++) {
      if (d * e == b) {
        h++
        break outer
      }
    }
  }
  if (b == c) {
    break
  }
  b += 17
}

console.log('Part 2:', h)
