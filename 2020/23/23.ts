import { $, forEach, ints, join, last, map, product, range, readInput, repeat, slice, split } from '../../common'

type LL = {
  car: number
  cdr: LL
}

const _index: LL[] = []

const buildLL = (values: number[], first?: LL): LL => {
  const list: LL[] = $(
    values,
    map(v => ({
      car: v,
      cdr: null
    }))
  )
  $(
    list,
    slice(0, -1),
    forEach((item, i) => {
      item.cdr = list[i + 1]
      _index[item.car] = item
    })
  )
  $(list, last, item => {
    item.cdr = first || list[0]
    _index[item.car] = item
  })
  return list[0]
}

const findLL = (v: number) => (): LL => _index[v]

const takeLL =
  (n: number) =>
  (l: LL): number[] =>
    n == 1 ? [l.car] : [l.car, ...$(l.cdr, takeLL(n - 1))]

const destination = (n: number, andNot: number[], max: number) => {
  const next = n > 1 ? n - 1 : max
  return andNot.includes(next) ? destination(next, andNot, max) : next
}

const step =
  (max: number) =>
  (l: LL): LL => {
    const threeNext = $(l.cdr, takeLL(3))
    l.cdr = l.cdr.cdr.cdr.cdr
    const dest = $(l, findLL(destination(l.car, threeNext, max)))
    const threeNew = buildLL(threeNext, dest.cdr)
    dest.cdr = threeNew
    return l.cdr
  }

const input = $(readInput(), split(), ints)

console.log('Part 1:', $(input, buildLL, repeat(100, step(9)), findLL(1), takeLL(9), slice(1), join('')))

const input2 = [...input, ...range(10, 1000001)]

console.log('Part 2:', $(input2, buildLL, repeat(10000000, step(1000000)), findLL(1), takeLL(3), slice(1), product))
