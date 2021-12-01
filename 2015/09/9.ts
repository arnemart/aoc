import {
  $,
  every,
  filter,
  find,
  flatten,
  int,
  intoSet,
  isNull,
  lines,
  map,
  match,
  max,
  min,
  not,
  permutations,
  pipe,
  pluck,
  readInput,
  slice,
  spy,
  sum,
  values,
  zipWith
} from '../../common'

type Dist = {
  from: string
  to: string
  dist: number
}

const input = $(
  readInput(),
  lines,
  map(
    pipe(
      match(/^(\w+) to (\w+) = (\d+)$/),
      matches =>
        ({
          from: matches[1],
          to: matches[2],
          dist: $(matches[3], int)
        } as Dist)
    )
  )
)

const cities = $(
  input,
  map(d => [d.from, d.to]),
  flatten(),
  intoSet,
  values
)

const distances = $(
  cities,
  permutations,
  map(
    pipe(
      c => $(c, zipWith(c.slice(1))),
      slice(0, -1),
      map(([c1, c2]) =>
        $(
          input,
          find(d => (d.from == c1 && d.to == c2) || (d.from == c2 && d.to == c1))
        )
      )
    )
  ),
  filter(every(not(isNull))),
  map(pipe(map(pluck('dist')), sum))
)

console.log('Part 1:', $(distances, min))
console.log('Part 2:', $(distances, max))
