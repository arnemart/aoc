import {
  $,
  filter,
  first,
  flatmap,
  flatten,
  frequencies,
  groupBy,
  gt,
  int,
  join,
  last,
  lines,
  map,
  mapEntries,
  match,
  matchAll,
  pipe,
  pluck,
  product,
  range,
  readInput,
  sort,
  sortBy,
  split,
  sum,
  tee,
  test,
  values
} from '../../common'

type Shift = { guard: number; asleep: number[] }

const shifts: Shift[] = $(
  readInput(),
  lines,
  sort(),
  map((line, i) => (i > 0 && $(line, test(/begins shift/)) ? '\n' + line : line)),
  join('\n'),
  split('\n\n'),
  map(
    pipe(match(/^.+Guard #(\d+) begins shift(.*)$/ms), ([_, guard, rest]) => ({
      guard: int(guard),
      asleep: $(
        rest,
        matchAll(/:(\d\d)\] falls asleep.+?:(\d\d)\] wakes/gms),
        flatmap(([_, m1, m2]) => range(int(m1), int(m2)))
      )
    }))
  )
)

type Guard = { id: number; asleep: Map<number, number> }

const guards: Guard[] = $(
  shifts,
  groupBy(pluck('guard')),
  mapEntries,
  map(([id, shifts]) => ({ id, asleep: $(shifts, map(pluck('asleep')), flatten(), frequencies) }))
)

const mostAsleepGuard = $(guards, sortBy(pipe(pluck('asleep'), values, sum)), last)

console.log(
  'Part 1:',
  $([mostAsleepGuard.id, $(mostAsleepGuard.asleep, mapEntries, sortBy(last), last, first)], product)
)

const mostAsleepOnTheSameMinute = $(
  guards,
  filter(pipe(pluck('asleep'), a => a.size, gt(0))),
  map(({ id, asleep }) => ({ id, maxAsleep: $(asleep, mapEntries, sortBy(last), last) })),
  sortBy(pipe(pluck('maxAsleep'), last)),
  last
)

console.log('Part 2:', $(mostAsleepOnTheSameMinute, tee(pluck('id'), pipe(pluck('maxAsleep'), first)), product))
