import {
  $,
  count,
  flatmap,
  gt,
  gte,
  is,
  join,
  last,
  length,
  loopUntil,
  map,
  match,
  not,
  nth,
  partition,
  pipe,
  pluck,
  readInput,
  repeat,
  replace,
  sortBy,
  split,
  spy,
  spyWith,
  substr,
  test,
  toString,
  unique,
  uniqueBy
} from '../../common'

const input = $(readInput(), substr(1, -1), replace(/\(\w+\|\)/g, ''))

const optionReg = /\(([\w\|]+)\)/

const simplify = replace(optionReg, (_, s) => $(s, split('|'), sortBy(length), last))

const simplified = loopUntil((_, str) => simplify(str), not(test(/\(/)), input)

console.log('Part 1:', simplified.length + 1)

const complexify = (str: string) =>
  $(str, match(optionReg), match =>
    $(
      match,
      nth(1),
      split('|'),
      uniqueBy(length),
      map(s => $(str, substr(0, match.index)) + s + $(str, substr(match.index + match[0].length)))
    )
  )

const complexified = loopUntil(
  (_, { done, notDone }) =>
    $(notDone, flatmap(complexify), partition(test(/\(/)), ([notDone, newDone]) => ({
      done: [...done, ...$(newDone, map(length))],
      notDone: $(notDone, spyWith(length))
    })),
  pipe(pluck('notDone'), length, is(0)),
  {
    done: [] as number[],
    notDone: [input]
  }
).done

console.log('Part 2:', $(complexified, count(gte(1000))))
