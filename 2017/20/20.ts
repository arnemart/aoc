import {
  $,
  abs,
  entries,
  filter,
  first,
  groupBy,
  ints,
  is,
  join,
  last,
  length,
  map,
  parse,
  pipe,
  pluck,
  readInput,
  repeat,
  slice,
  sortBy,
  split,
  sum,
  zipWith
} from '../../common'

type Particle = { p: number[]; v: number[]; a: number[] }
const particles: Particle[] = $(
  readInput(),
  parse(
    /^p=\<([^\>]+)\>, v=\<([^\>]+)\>, a=\<([^\>]+)\>$/,
    pipe(slice(1, 4), map(pipe(split(','), ints)), ([p, v, a]) => ({ p, v, a }))
  )
)

const step: (particles: Particle[]) => Particle[] = map(
  pipe(
    p => ({
      ...p,
      v: $(p.v, zipWith(p.a), map(sum))
    }),
    p => ({
      ...p,
      p: $(p.p, zipWith(p.v), map(sum))
    })
  )
)

console.log(
  'Part 1:',
  $(
    particles,
    repeat(500, step),
    map((p, i) => [$(p.p, map(abs), sum), i]),
    sortBy(first),
    first,
    last
  )
)

const step2 = pipe(
  step,
  groupBy(pipe(pluck('p'), join(','))),
  entries,
  filter(pipe(last, length, is(1))),
  map(pipe(last, first))
)

console.log('Part 2:', $(particles, repeat(500, step2), length))
