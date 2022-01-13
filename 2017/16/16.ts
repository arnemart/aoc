import {
  $,
  allEqual,
  cond,
  first,
  indexOf,
  int,
  join,
  last,
  loopUntil,
  map,
  match,
  pipe,
  readInput,
  reduce,
  set,
  shift,
  split,
  tee
} from '../../common'

type Move =
  | { name: 's'; v1: number; v2: undefined }
  | { name: 'x'; v1: number; v2: number }
  | { name: 'p'; v1: string; v2: string }

const moves = $(
  readInput(),
  split(','),
  map(
    pipe(
      match(/^(\w)(\w+)(\/(\w+))?$/),
      ([_, n, a, __, b]) =>
        ({
          name: n,
          v1: n == 'p' ? a : int(a),
          v2: n == 'x' ? int(b) : b
        } as Move)
    )
  )
)

const step = (state: string[], { name, v1, v2 }: Move): string[] =>
  $(
    name,
    cond([
      ['s', () => $(state, shift(v1 as number))],
      [
        'x',
        () => {
          const temp = state[v1]
          return $(state, set(v1, state[v2]), set(v2, temp))
        }
      ],
      ['p', () => step(state, { name: 'x', v1: $(state, indexOf(v1)), v2: $(state, indexOf(v2)) })]
    ])
  )

const dance = (state: string) => $(moves, reduce(step, $(state, split())), join())

const initialState = 'abcdefghijklmnop'

console.log('Part 1:', $(initialState, dance))

const dances = loopUntil((_, dances) => [...dances, dance($(dances, last))], pipe(tee(first, last), allEqual), [
  initialState
])

console.log('Part 2:', dances[1000000000 % (dances.length - 1)])
