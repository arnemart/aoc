import {
  $,
  cond,
  filter,
  ints,
  is,
  lines,
  map,
  match,
  pipe,
  pluck,
  product,
  readInput,
  reduce,
  sum
} from '../../common'

type Dir = 'x' | 'y'
type Command = {
  dir: Dir
  dist: number
}

const input: Command[] = $(
  readInput(),
  lines,
  map(
    pipe(match(/^(up|down|forward) (\d+)$/), matches => ({
      dir: $(matches[1], cond([['forward', 'x']], 'y')),
      dist: $([matches[2], $(matches[1], cond([['up', -1]], 1))], ints, product)
    }))
  )
)

const sumDir = (dir: Dir): ((commands: Command[]) => number) =>
  pipe(filter(pipe(pluck('dir'), is(dir))), map(pluck('dist')), sum)

console.log('Part 1:', $([$(input, sumDir('x')), $(input, sumDir('y'))], product))

console.log(
  'Part 2:',
  $(
    input,
    reduce(
      (state, d) =>
        $(
          d.dir,
          cond([
            ['y', () => ({ ...state, aim: state.aim + d.dist })],
            ['x', () => ({ ...state, x: state.x + d.dist, y: state.y + state.aim * d.dist })]
          ])
        ),
      { aim: 0, x: 0, y: 0 }
    ),
    state => state.x * state.y
  )
)
