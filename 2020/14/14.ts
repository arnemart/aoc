import {
  $,
  chars,
  cond,
  flatten,
  join,
  leftPad,
  map,
  number,
  parse,
  pluck,
  readInput,
  reduce,
  slice,
  split,
  sum,
  values,
  zipWith
} from '../../common'

const reg = /^(mask|mem)(\[(\d+)\])? = ([0-9X]+)$/

type MaskCmd = { type: 'mask'; mask: string[] }
type MemCmd = { type: 'mem'; pos: number; val: number }
type Cmd = MaskCmd | MemCmd

const input: Cmd[] = $(
  readInput(),
  parse(reg, ([_0, type, _2, pos, val]) => {
    if (type == 'mask') {
      return {
        type: 'mask',
        mask: $(val, split())
      } as MaskCmd
    } else {
      return {
        type: 'mem',
        pos: $(pos, number()),
        val: $(val, number())
      } as MemCmd
    }
  })
)

const zipWithMask =
  (mask: string[]) =>
  (num: number): [string, string][] =>
    $(num, n => n.toString(2), leftPad(36, '0'), chars, zipWith(mask))

const maskNumber = (num: number, mask: string[]): number =>
  $(
    num,
    zipWithMask(mask),
    map(([s, m]) => (m == 'X' ? s : m)),
    join(),
    number(2)
  )

type Mem = { [key: number]: number }
type State = { currentMask: MaskCmd; mem: Mem }

const sumMem = (state: State | State2): number => $(state, pluck('mem'), values, sum)

const step1 = (cmds: Cmd[]): number =>
  $(
    cmds,
    slice(1),
    reduce(
      (state, cmd) =>
        cmd.type == 'mask'
          ? {
              ...state,
              currentMask: cmd
            }
          : {
              ...state,
              mem: {
                ...state.mem,
                [cmd.pos]: maskNumber(cmd.val, state.currentMask.mask)
              }
            },
      {
        currentMask: cmds[0],
        mem: {}
      } as State
    ),
    sumMem
  )

console.log('Part 1:', step1(input))

const enumerateMasks = (mask: string[]): string[][] =>
  $(
    mask,
    reduce(
      (masks, v) =>
        v == 'X'
          ? $(
              masks,
              map(m => [
                [...m, 'X'],
                [...m, '1']
              ]),
              flatten()
            )
          : $(
              masks,
              map(m => [...m, v])
            ),
      [[]]
    )
  )

const writeToMem = (mem: Mem, masks: string[][], pos: number, val: number): Mem =>
  $(
    masks,
    map(mask => $(pos, zipWithMask(mask))),
    map(
      map(([p, m]) =>
        $(
          m,
          cond(
            [
              ['0', p],
              ['X', '0']
            ],
            '1'
          )
        )
      )
    ),
    map(join()),
    reduce((mem, addr) => {
      mem[addr] = val
      return mem
    }, mem)
  )

type State2 = { masks: string[][]; mem: Mem }

const step2 = (cmds: Cmd[]): number =>
  $(
    cmds,
    slice(1),
    reduce(
      (state, cmd) =>
        cmd.type == 'mask'
          ? { ...state, masks: enumerateMasks(cmd.mask) }
          : { ...state, mem: writeToMem(state.mem, state.masks, cmd.pos, cmd.val) },
      {
        masks: enumerateMasks((cmds[0] as MaskCmd).mask),
        mem: {}
      } as State2
    ),
    sumMem
  )

console.log('Step 2:', step2(input))
