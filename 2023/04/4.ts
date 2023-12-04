import {
  $,
  add,
  fillArray,
  filter,
  gt,
  int,
  intersect,
  intoSet,
  last,
  length,
  lines,
  map,
  pipe,
  pow,
  range,
  readInput,
  reduce,
  split,
  spy,
  subtract,
  sum,
  tee,
  update
} from '../../common'

$(
  readInput(),
  lines,
  map(pipe(split(/:\s*/), last, split(/\s*\|\s*/), map(pipe(split(/\s+/), map(int), intoSet)), intersect, length)),
  tee(
    pipe(filter(gt(0)), map(pipe(subtract(1), pow(2))), sum),
    pipe(wins =>
      $(
        wins,
        length,
        range,
        reduce(
          (cards, card) =>
            $(
              range(card + 1, wins[card] + card + 1),
              reduce((cs, c) => $(cs, update(c, add(cards[card]))), cards)
            ),
          fillArray(length(wins), 1)
        ),
        sum
      )
    )
  ),
  spy
)
