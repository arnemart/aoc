import {
  $,
  add,
  ceil,
  clone,
  div,
  findIndex,
  first,
  floor,
  getIn,
  lastIndexOf,
  lines,
  loopUntil,
  map,
  max,
  mult,
  permutations,
  pipe,
  pluck,
  push,
  readInput,
  reduce,
  setIn,
  slice,
  sum,
  tee,
  unroll
} from '../../common'

type SN = number | [SN, SN]

const snailfishNumbers: SN[] = $(
  readInput(),
  lines,
  map(s => JSON.parse(s))
)

const findOp = (sn: SN, op: (i: number[]) => (sn: SN) => boolean, index = []): number[] => {
  if (sn instanceof Array) {
    const isHere = $(sn, findIndex(op(index)))
    return isHere == 0
      ? [...index, 0]
      : findOp(sn[0], op, [...index, 0]) || (isHere == 1 ? [...index, 1] : findOp(sn[1], op, [...index, 1]))
  } else {
    return null
  }
}

const findNextOperation = (sn: SN): number[] =>
  findOp(
    sn,
    index => sn => index.length >= 3 && sn instanceof Array && typeof sn[0] == 'number' && typeof sn[1] == 'number'
  ) || findOp(sn, _ => sn => typeof sn == 'number' && sn >= 10)

const findNumber = (sn: [SN, SN], index: number[], lr: number) => {
  const recur = (sn: [SN, SN], index: number[]) => {
    const v = $(sn, getIn(...index))
    if (v instanceof Array) {
      return recur(sn, [...index, 1 - lr]) || recur(sn, [...index, lr])
    } else {
      return index
    }
  }
  const theLast = $(index, lastIndexOf(1 - lr))
  if (theLast > -1) {
    return recur(sn, $(index, slice(0, theLast), push(lr)))
  } else {
    return null
  }
}

const setInOrNot =
  <T, U>(keys: (string | number)[], val: T | ((v: T) => T)) =>
  (o: U): U =>
    keys ? $(o, setIn(keys, val)) : o

const snReductionStep = (sn: [SN, SN]): SN => {
  const where = $(sn, findNextOperation)
  const what = $(sn, getIn(...where))
  return where
    ? what instanceof Array
      ? $(
          sn,
          setInOrNot(findNumber(sn, where, 0), add(what[0] as number)),
          setInOrNot(findNumber(sn, where, 1), add(what[1] as number)),
          setInOrNot(where, 0)
        )
      : $(sn, setIn(where, $(what, div(2), tee(floor, ceil))))
    : sn
}

const snReduce = (sn: SN): SN =>
  $(
    loopUntil(
      (_, { sn }) => {
        const nextSn = snReductionStep(clone(sn))
        return { sn: nextSn, prev: JSON.stringify(sn) }
      },
      ({ sn, prev }) => JSON.stringify(sn) == prev,
      { sn, prev: '' }
    ),
    pluck('sn')
  )

const magnitude = (sn: SN): number =>
  sn instanceof Array ? $(sn, unroll(pipe(magnitude, mult(3)), pipe(magnitude, mult(2))), sum) : sn

const addSn = (n1: SN, n2: SN) => $([n1, n2], snReduce)
const addAllSns = (sns: SN[]) => $(sns, slice(1), reduce(addSn, $(sns, first)), magnitude)

console.log('Part 1:', $(snailfishNumbers, addAllSns))

console.log('Part 2:', $(snailfishNumbers, permutations(2), map(addAllSns), max))
