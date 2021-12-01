import { $, cond, fillArray, filter, flatten, int, length, lines, map, match, max, pipe, readInput, reduce, sum } from '../../common'

type Lit = 'on' | 'off' | 'toggle'
type Instruction = {
  lit: Lit
  x1: number
  y1: number
  x2: number
  y2: number
}

const lights = $(
  fillArray(1000),
  map(_ => fillArray(1000, false))
)

const input: Instruction[] = $(
  readInput(),
  lines,
  map(
    pipe(match(/(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)/), matches => ({
      lit: matches[1] as 'on' | 'off' | 'toggle',
      x1: int(matches[2]),
      y1: int(matches[3]),
      x2: int(matches[4]),
      y2: int(matches[5])
    }))
  )
)

const step =
  <T, U>(conds: (val: U) => [Lit, U][]) =>
  (lights: U[][], ins: Instruction): U[][] =>
    $(
      lights,
      map((row, y) =>
        $(
          row,
          map((val, x) => {
            if (x >= ins.x1 && x <= ins.x2 && y >= ins.y1 && y <= ins.y2) {
              return $(ins.lit, cond(conds(val)))
            }
            return val
          })
        )
      )
    )

console.log(
  'Part 1:',
  $(
    input,
    reduce(
      step(val => [
        ['on', true],
        ['off', false],
        ['toggle', !val]
      ]),
      lights
    ),
    flatten(),
    filter(Boolean),
    length
  )
)

const lights2 = $(
  fillArray(1000),
  map(_ => fillArray(1000, 0))
)

console.log(
  'Part 2:',
  $(
    input,
    reduce(
      step(val => [
        ['on', val + 1],
        ['off', $([val - 1, 0], max)],
        ['toggle', val + 2]
      ]),
      lights2
    ),
    flatten(),
    sum
  )
)
