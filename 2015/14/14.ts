import {
  $,
  add,
  cond,
  find,
  floor,
  int,
  is,
  map,
  max,
  min,
  mod,
  parse,
  pipe,
  pluck,
  product,
  range,
  readInput,
  reduce,
  sum
} from '../../common'

type Reindeer = {
  name: string
  speed: number
  time: number
  rest: number
}

const input = $(
  readInput(),
  parse<Reindeer>(/^(\w+) .+ (\d+) .+ (\d+) .+ (\d+) .+$/, matches => ({
    name: matches[1],
    speed: $(matches[2], int),
    time: $(matches[3], int),
    rest: $(matches[4], int)
  }))
)

const distance =
  (time: number) =>
  (r: Reindeer): number =>
    $(
      [
        $([$(time / $(r, pluck(['time', 'rest']), sum), floor), r.speed, r.time], product),
        $([$([$(time, mod($(r, pluck(['time', 'rest']), sum))), r.time], min), r.speed], product)
      ],
      sum
    )

console.log('Part 1:', $(input, map(distance(2503)), max))

type ReindeerDistances = {
  name: string
  distance: number
}

const distances =
  (time: number) =>
  (reindeer: Reindeer[]): ReindeerDistances[][] =>
    $(
      range(time),
      map(t =>
        $(
          reindeer,
          map(r => ({
            name: r.name,
            distance: distance(t)(r)
          }))
        )
      )
    )

type ReindeerPoints = {
  name: string
  points: number
}

const points = (dists: ReindeerDistances[][]): ReindeerPoints[] =>
  $(
    dists,
    reduce(
      (points, dist) => {
        const maxDist = $(dist, map(pluck('distance')), max)
        return $(
          points,
          map(p => ({
            name: p.name,
            points: $(
              p.points,
              add($(dist, find(pipe(pluck('name'), is(p.name))), pluck('distance'), cond([[maxDist, 1]], 0)))
            )
          }))
        )
      },
      $(
        input,
        map(r => ({
          name: r.name,
          points: -1
        }))
      )
    )
  )

console.log('Part 2:', $(input, distances(2503), points, map(pluck('points')), max))
