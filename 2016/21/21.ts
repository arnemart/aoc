import {
  $,
  cond,
  flatten,
  indexOf,
  int,
  join,
  parse,
  readInput,
  reduce,
  reverse,
  shift,
  slice,
  split
} from '../../common'

const reg = new RegExp(
  '^(swap) (position|letter) (\\w+) with \\2 (\\w+)' +
    '|(rotate) (left|right) (\\d+) \\w+' +
    '|(rotate) based .+ letter (\\w)' +
    '|(reverse) positions (\\d+) through (\\d+)' +
    '|(move) position (\\d+) to position (\\d+)$'
)

type Operation = { type: string; v1?: number | string; v2?: number | string }

const operations: Operation[] = $(
  readInput(),
  parse(reg, m => {
    if (m[1] && m[2] == 'position') {
      return { type: 'swapPosition', v1: int(m[3]), v2: int(m[4]) }
    } else if (m[1] && m[2] == 'letter') {
      return { type: 'swapLetter', v1: m[3], v2: m[4] }
    } else if (m[5]) {
      return { type: 'rotate', v1: int((m[6] == 'left' ? '-' : '') + m[7]) }
    } else if (m[8]) {
      return { type: 'rotateLetter', v1: m[9] }
    } else if (m[10]) {
      return { type: 'reverse', v1: int(m[11]), v2: int(m[12]) }
    } else if (m[13]) {
      return { type: 'move', v1: int(m[14]), v2: int(m[15]) }
    }
  })
)

const performOperation = (op: Operation) => (str: string[]) =>
  $(
    op.type,
    cond([
      [
        'swapPosition',
        () => {
          const tmp = str[op.v1]
          str[op.v1] = str[op.v2]
          str[op.v2] = tmp
          return str
        }
      ],
      [
        'swapLetter',
        () => $(str, performOperation({ type: 'swapPosition', v1: $(str, indexOf(op.v1)), v2: $(str, indexOf(op.v2)) }))
      ],
      ['rotate', () => $(str, shift(op.v1 as number))],
      [
        'rotateLetter',
        () => {
          const i = $(str, indexOf(op.v1))
          return $(str, shift(1 + i + (i >= 4 ? 1 : 0)))
        }
      ],
      [
        'reverse',
        () =>
          $(
            [
              $(str, slice(0, op.v1 as number)),
              $(str, slice(op.v1 as number, (op.v2 as number) + 1), reverse),
              $(str, slice((op.v2 as number) + 1))
            ],
            flatten()
          )
      ],
      [
        'move',
        () => {
          const s = str.splice(op.v1 as number, 1)
          str.splice(op.v2 as number, 0, s[0])
          return str
        }
      ]
    ])
  )

console.log(
  'Part 1:',
  $(
    operations,
    reduce((str, op) => $(str, performOperation(op)), $('abcdefgh', split())),
    join()
  )
)

const performOppositeOperation =
  ({ type, v1, v2 }: Operation) =>
  (str: string[]) =>
    $(
      type,
      cond([
        [['swapPosition', 'swapLetter', 'move'], () => $(str, performOperation({ type, v1: v2, v2: v1 }))],
        ['rotate', () => $(str, shift(-v1 as number))],
        [
          'rotateLetter',
          () => {
            const shifts = { 0: 7, 1: -1, 2: 2, 3: -2, 4: 1, 5: -3, 6: 0, 7: -4 }
            return $(str, shift(shifts[$(str, indexOf(v1))]))
          }
        ],
        ['reverse', () => $(str, performOperation({ type, v1, v2 }))]
      ])
    )

console.log(
  'Part 2:',
  $(
    operations,
    reverse,
    reduce((str, op) => $(str, performOppositeOperation(op)), $('fbgdceah', split())),
    join()
  )
)
