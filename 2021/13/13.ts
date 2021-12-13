import {
  $,
  add,
  count,
  fillArray,
  first,
  flatten,
  getIn,
  int,
  ints,
  is,
  last,
  length,
  lines,
  map,
  max,
  or,
  parse,
  pipe,
  printGrid,
  range,
  readInput,
  reduce,
  reverse,
  setIn,
  split,
  tee,
  zip
} from '../../common'

type Dots = boolean[][]
type Fold = { dir: 'x' | 'y'; at: number }

const [dots, folds] = $(
  readInput(),
  split('\n\n'),
  tee(
    pipe(first, lines, map(pipe(split(','), ints, reverse)), dots =>
      $(
        dots,
        reduce(
          (grid, dot) => $(grid, setIn(dot, true)),
          fillArray($(dots, tee(pipe(map(last), max, add(1)), pipe(map(first), max, add(1)))), false)
        )
      )
    ),
    pipe(
      last,
      parse(/(x|y)=(\d+)/, ([_, dir, at]) => ({ dir, at: int(at) }))
    )
  )
) as [Dots, Fold[]]

const fold = {
  y:
    (at: number) =>
    (dots: Dots): Dots =>
      $(
        range(at),
        map(y =>
          $(
            range($(dots, first, length)),
            map(x => $(dots, or(getIn(y, x), getIn(dots.length - y - 1, x))))
          )
        )
      ),
  x:
    (at: number) =>
    (dots: Dots): Dots =>
      $(dots, zip, fold.y(at), zip) as Dots
}

const countDots = (dots: Dots) => $(dots, flatten(), count(is(true)))

console.log('Part 1:', $(dots, fold[folds[0].dir](folds[0].at), countDots))

console.log('Part 2:')

$(
  folds,
  reduce((grid, f) => $(grid, fold[f.dir](f.at)), dots),
  printGrid
)
