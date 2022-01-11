import {
  $,
  abs,
  add,
  ceil,
  cond,
  div,
  filter,
  gte,
  intdiv,
  last,
  length,
  loopUntil,
  map,
  mod,
  nth,
  pipe,
  range,
  slice,
  subtract,
  sum,
  within
} from '../../common'

const input = 289326

const getSpiral = (n: number) => loopUntil((i, l) => [...l, $(i, intdiv(2), add(1))], pipe(sum, gte(n)), [])

const xys: Map<number, number[]> = new Map([
  [0, [0, 0]],
  [1, [1, 0]]
])
const xy = (n: number) => {
  if (!xys.has(n)) {
    const sp = getSpiral(n)
    const v1 = $(sp, nth(-2), div(2), ceil)
    const v2 = $(sp, last, intdiv(2), subtract($(n, subtract($(sp, slice(0, -1), sum)))))
    xys.set(
      n,
      $(
        sp,
        length,
        mod(4),
        cond([
          [0, [-v1, -v2]],
          [1, [-v2, v1]],
          [2, [v1, v2]],
          [3, [v2, -v1]]
        ])
      )
    )
  }
  return xys.get(n)
}

console.log('Part 1:', $(input, subtract(1), xy, map(abs), sum))

const nths: Map<number, number> = new Map([[0, 1]])
const nthNumber = (n: number) => {
  if (!nths.has(n)) {
    nths.set(
      n,
      $(
        range(n),
        filter(n2 => $(xy(n)[0] - xy(n2)[0], within(-1, 1)) && $(xy(n)[1] - xy(n2)[1], within(-1, 1))),
        map(nthNumber),
        sum
      )
    )
  }
  return nths.get(n)
}

console.log('Part 2:', loopUntil(nthNumber, gte(input)))
