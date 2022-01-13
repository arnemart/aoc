import { $, cond, int, loopUntil, numeric, parse, readInput, slice, sqrt } from '../../common'

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
  id: number
  prog: Cmd[]
  pc: number
  reg: Record<string, number>
  sent: number
  queue: number[]
  waiting: boolean
  sndCount: number
}

const v = (state: State, what: string | number) => (numeric(what) ? what : state.reg[what] || 0) as number

type StepCmd = (state: State, cmd: Cmd) => () => State

const step =
  (sndCmd: StepCmd, rcvCmd: StepCmd) =>
  (state: State): State =>
    $(state.prog[state.pc], cmd =>
      $(
        cmd?.cmd,
        cond(
          [
            ['snd', sndCmd(state, cmd)],
            ['rcv', rcvCmd(state, cmd)],
            ['set', () => ({ ...state, pc: state.pc + 1, reg: { ...state.reg, [cmd.v1]: v(state, cmd.v2) } })],
            [
              'add',
              () => ({
                ...state,
                pc: state.pc + 1,
                reg: { ...state.reg, [cmd.v1]: v(state, cmd.v1) + v(state, cmd.v2) }
              })
            ],
            [
              'mul',
              () => ({
                ...state,
                pc: state.pc + 1,
                reg: { ...state.reg, [cmd.v1]: v(state, cmd.v1) * v(state, cmd.v2) }
              })
            ],
            [
              'mod',
              () => ({
                ...state,
                pc: state.pc + 1,
                reg: { ...state.reg, [cmd.v1]: v(state, cmd.v1) % v(state, cmd.v2) }
              })
            ],
            ['jgz', () => ({ ...state, pc: state.pc + (v(state, cmd.v1) > 0 ? v(state, cmd.v2) : 1) })]
          ],
          { ...state, waiting: true }
        )
      )
    )

const initialize = (id = 0): State => ({
  id,
  prog: program,
  pc: 0,
  reg: { p: id },
  sent: null,
  queue: [],
  waiting: false,
  sndCount: 0
})

const step1 = step(
  (state, cmd) => () => ({ ...state, pc: state.pc + 1, reg: { ...state.reg, snd: v(state, cmd.v1) } }),
  (state, cmd) => () => ({
    ...state,
    pc: state.pc + 1,
    reg: { ...state.reg, rcv: v(state, cmd.v1) > 0 ? v(state, 'snd') : 0 }
  })
)

console.log(
  'Part 1:',
  loopUntil(
    (_, state) => step1(state),
    ({ reg }) => reg.rcv > 0,
    initialize()
  ).reg.rcv
)

const step2 = step(
  (state, cmd) => () => ({ ...state, pc: state.pc + 1, sent: v(state, cmd.v1), sndCount: state.sndCount + 1 }),
  (state, cmd) => () =>
    state.queue.length > 0
      ? {
          ...state,
          waiting: false,
          pc: state.pc + 1,
          reg: { ...state.reg, [cmd.v1]: state.queue[0] },
          queue: $(state.queue, slice(1))
        }
      : { ...state, waiting: true }
)

console.log(
  'Part 2:',
  loopUntil(
    (_, { state0, state1 }) =>
      $([step2(state0), step2(state1)], ([s0, s1]) => ({
        state0: { ...s0, sent: null, queue: s1.sent != null ? [...s0.queue, s1.sent] : s0.queue },
        state1: { ...s1, sent: null, queue: s0.sent != null ? [...s1.queue, s0.sent] : s1.queue }
      })),
    ({ state0, state1 }) => state0.waiting && state1.waiting,
    { state0: initialize(0), state1: initialize(1) }
  ).state1.sndCount
)
