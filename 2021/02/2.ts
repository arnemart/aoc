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

const input = $(
  readInput(),
  lines,
  map(
    pipe(match(/^(up|down|forward) (\d+)$/), matches => ({
      dir: $(
        matches[1],
        cond([
          ['forward', 'x'],
          [['up', 'down'], 'y']
        ])
      ),
      dist: $([matches[2], $(matches[1], cond([['up', -1]], 1))], ints, product)
    }))
  )
)

console.log(
  'Part 1:',
  $(
    [
      $(input, filter(pipe(pluck('dir'), is('y'))), map(pluck('dist')), sum),
      $(input, filter(pipe(pluck('dir'), is('y'))), map(pluck('dist')), sum)
    ],
    product
  )
)

console.log(
  'Part 2:',
  $(
    input,
    reduce(
      (state, d) =>
        $(
          d.dir,
          cond([
            [
              'y',
              () => ({
                ...state,
                aim: state.aim + d.dist
              })
            ],
            [
              'x',
              () => ({
                ...state,
                x: state.x + d.dist,
                y: state.y + state.aim * d.dist
              })
            ]
          ])
        ),
      { aim: 0, x: 0, y: 0 }
    ),
    state => state.x * state.y
  )
)
