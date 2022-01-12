import { $, add, clone, indexOf, ints, join, loopUntil, max, readInput, repeat, set, split } from '../../common'

const memoryBanks = $(readInput(), split(/\t/), ints)

const redistribute = (banks: number[]) =>
  $(clone(banks), max, m =>
    $(banks, indexOf(m), i =>
      $(
        banks,
        set(i, 0),
        repeat(m, (b, j) => $(banks, set((i + j + 1) % banks.length, add(1))))
      )
    )
  ) as number[]

const seenStates: Map<string, number> = new Map()
const seen = (banks: number[]) =>
  $(banks, join(','), k =>
    $(
      k,
      k => seenStates.set(k, (seenStates.get(k) || 0) + 1),
      () => seenStates.get(k) - 1
    )
  )

console.log(
  'Part 1:',
  loopUntil(
    (i, { banks }) => ({ i, banks: redistribute(banks) }),
    ({ banks }) => seen(banks) > 0,
    { i: 0, banks: memoryBanks }
  ).i + 1
)

console.log(
  'Part 2:',
  loopUntil(
    (i, { banks }) => ({ i, banks: redistribute(banks) }),
    ({ banks }) => seen(banks) > 1,
    { i: 0, banks: memoryBanks }
  ).i + 1
)
