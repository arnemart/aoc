import { $, add, cond, even, getIn, int, intdiv, loopUntil, mult, parse, pluck, readInput, set } from '../../common'

type Register = 'a' | 'b'
type Instruction =
  | {
      cmd: 'hlf' | 'tpl' | 'inc'
      reg: Register
    }
  | {
      cmd: 'jmp'
      offset: number
    }
  | {
      cmd: 'jie' | 'jio'
      reg: Register
      offset: number
    }
type Program = Instruction[]

type State = {
  a: number
  b: number
  pc: number
  program: Program
}

const program = $(
  readInput(),
  parse(/^(\w+) (a|b)?(, )?([+-]\d+)?$/, ([_, cmd, reg, __, num]) =>
    $(
      cmd,
      cond([
        [['hlf', 'tpl', 'inc'], { cmd, reg }],
        ['jmp', { cmd, offset: $(num, int) }],
        [['jie', 'jio'], { cmd, reg, offset: $(num, int) }]
      ])
    )
  )
) as Program

const step = (state: State): State =>
  $(state, getIn('program', state.pc), ins =>
    $(
      ins.cmd,
      cond([
        ['hlf', () => $({ ...state, pc: state.pc + 1 }, set(ins.reg, intdiv(2)))],
        ['tpl', () => $({ ...state, pc: state.pc + 1 }, set(ins.reg, mult(3)))],
        ['inc', () => $({ ...state, pc: state.pc + 1 }, set(ins.reg, add(1)))],
        ['jmp', () => ({ ...state, pc: state.pc + ins.offset })],
        ['jie', () => ({ ...state, pc: state.pc + $(state[ins.reg], even, cond([[true, ins.offset]], 1)) })],
        ['jio', () => ({ ...state, pc: state.pc + $(state[ins.reg], cond([['1', ins.offset]], 1)) })]
      ])
    )
  )

const runProgram = (state: State) =>
  $(
    loopUntil(
      (_, state) => $(state, step),
      state => state.pc >= state.program.length,
      state
    ),
    pluck('b')
  )

console.log('Part 1:', runProgram({ a: 0, b: 0, pc: 0, program }))

console.log('Part 2:', runProgram({ a: 1, b: 0, pc: 0, program }))
