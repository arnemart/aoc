import { $, cond, filter, int, is, map, parse, pipe, pluck, product, readInput, reduce, sum } from '../../common'

type Dir = 'x' | 'y'
type Command = {
  dir: Dir
  dist: number
}

const input: Command[] = $(
  readInput(),
  parse(/^(\w+) (\d+)$/, ([_, dir, dist]) => ({
    dir: $(dir, cond([['forward', 'x']], 'y')),
    dist: $([$(dist, int), $(dir, cond([['up', -1]], 1))], product)
  }))
)

const sumDir = (dir: Dir): ((commands: Command[]) => number) =>
  pipe(filter(pipe(pluck('dir'), is(dir))), map(pluck('dist')), sum)

console.log('Part 1:', $([$(input, sumDir('x')), $(input, sumDir('y'))], product))

console.log(
  'Part 2:',
  $(
    input,
    reduce(
      ({ aim, x, y }, { dir, dist }) =>
        $(
          dir,
          cond([
            ['y', () => ({ x, y, aim: aim + dist })],
            ['x', () => ({ aim, x: x + dist, y: y + aim * dist })]
          ])
        ),
      { aim: 0, x: 0, y: 0 }
    ),
    pluck(['x', 'y']),
    product
  )
)
