import { $, cond, getIn, int, loopUntil, parse, set, numeric } from '../common'

export type CmdType = 'cpy' | 'inc' | 'dec' | 'jnz'
export type Cmd = {
  type: CmdType
  v1: string
  v2: string
}
export type Machine = {
  a: number
  b: number
  c: number
  d: number
  pc: number
  program: Cmd[]
}

const v = (state: Machine, v: string): number => (numeric(v) ? int(v) : state[v])

export const parseProgram = (code: string) =>
  $(
    code,
    parse(/^(\w+) (-?\w+)( (-?\w+))?$/, ([_, type, v1, __, v2]) => ({ type, v1, v2 }))
  ) as Cmd[]

export const step = (state: Machine): Machine =>
  $(state, getIn('program', state.pc), (cmd: Cmd) =>
    $(
      cmd.type,
      cond([
        ['cpy', () => ({ ...state, pc: state.pc + 1, [cmd.v2]: v(state, cmd.v1) })],
        ['inc', () => ({ ...state, pc: state.pc + 1, [cmd.v1]: state[cmd.v1] + 1 })],
        ['dec', () => ({ ...state, pc: state.pc + 1, [cmd.v1]: state[cmd.v1] - 1 })],
        [
          'jnz',
          () => ({
            ...state,
            pc: state.pc + (v(state, cmd.v1) == 0 ? 1 : v(state, cmd.v2))
          })
        ],
        [
          'tgl',
          () => {
            const which = state.pc + v(state, cmd.v1)
            const c: Cmd = $(state, getIn('program', which))
            if (c) {
              const newCmd: Cmd = {
                ...c,
                type: $(
                  c.type,
                  cond([
                    ['inc', 'dec'],
                    [['dec', 'tgl'], 'inc'],
                    ['jnz', 'cpy'],
                    ['cpy', 'jnz']
                  ])
                )
              }
              return {
                ...state,
                pc: state.pc + 1,
                program: $(state.program, set(which, newCmd))
              }
            } else {
              return { ...state, pc: state.pc + 1 }
            }
          }
        ]
      ])
    )
  )

export const run = (state: Machine): Machine =>
  loopUntil(
    (_, state) => $(state, step),
    state => state.pc < 0 || state.pc >= state.program.length,
    state
  )

export const initialize =
  (extraVals = {}) =>
  (program: Cmd[]): Machine => ({ a: 0, b: 0, c: 0, d: 0, ...extraVals, pc: 0, program })

export const parseAndRun =
  (extraVals = {}) =>
  (input: string) =>
    $(input, parseProgram, initialize(extraVals), run)
