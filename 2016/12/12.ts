import { $, cond, getIn, int, loopUntil, parse, pluck, readInput, test } from '../../common'

type CmdType = 'cpy' | 'inc' | 'dec' | 'jnz'
type Reg = 'a' | 'b' | 'c' | 'd'
type Cmd = {
  type: CmdType
  r1: Reg
  r2: Reg
  val: number
}

const numeric = test(/^-?\d+/)

const program = $(
  readInput(
    `cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`,
    false
  ),
  parse(/^(\w+) (-?\w+)( (-?\w+))?$/, ([_, type, v1, __, v2]) => ({
    type,
    r1: numeric(v1) ? null : v1,
    r2: type == 'cpy' ? v2 : null,
    val: $(
      type,
      cond(
        [
          ['cpy', numeric(v1) ? int(v1) : null],
          ['jnz', int(v2)]
        ],
        null
      )
    )
  }))
) as Cmd[]

type Machine = {
  a: number
  b: number
  c: number
  d: number
  pc: number
  program: Cmd[]
}

const step = (state: Machine): Machine =>
  $(state, getIn('program', state.pc), cmd =>
    $(
      cmd.type,
      cond([
        ['cpy', { ...state, pc: state.pc + 1, [cmd.r2]: cmd.r1 ? state[cmd.r1] : cmd.val }],
        ['inc', { ...state, pc: state.pc + 1, [cmd.r1]: state[cmd.r1] + 1 }],
        ['dec', { ...state, pc: state.pc + 1, [cmd.r1]: state[cmd.r1] - 1 }],
        ['jnz', { ...state, pc: state.pc + (state[cmd.r1] == 0 ? 1 : cmd.val) }]
      ])
    )
  )

const run = (state: Machine): Machine =>
  loopUntil(
    (_, state) => step(state),
    state => state.pc >= state.program.length,
    state
  )

const initialize = (program: Cmd[], vals = {}): Machine => ({ a: 0, b: 0, c: 0, d: 0, ...vals, pc: 0, program })

console.log('Part 1:', $(initialize(program), run, pluck('a')))

console.log('Part 1:', $(initialize(program, { c: 1 }), run, pluck('a')))
