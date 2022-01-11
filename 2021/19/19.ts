import {
  $,
  abs,
  arrEqual,
  difference,
  filter,
  find,
  findWithContext,
  first,
  ints,
  is,
  length,
  lines,
  loopUntil,
  map,
  max,
  nonNull,
  pipe,
  pluck,
  readInput,
  slice,
  some,
  split,
  sum,
  uniqueBy,
  uniquePermutations,
  zip,
  zipWith
} from '../../common'

type Scanner = number[][]
const scanners: Scanner[] = $(readInput(), split('\n\n'), map(pipe(lines, slice(1), map(split(',')), map(ints))))

const rotations = ([x, y, z]: number[]) => [
  [x, y, z],
  [x, z, -y],
  [x, -y, -z],
  [x, -z, y],
  [-x, z, y],
  [-x, y, -z],
  [-x, -z, -y],
  [-x, -y, z],

  [y, z, x],
  [y, x, -z],
  [y, -z, -x],
  [y, -x, z],
  [-y, x, z],
  [-y, z, -x],
  [-y, -x, -z],
  [-y, -z, x],

  [z, x, y],
  [z, y, -x],
  [z, -x, -y],
  [z, -y, x],
  [-z, y, x],
  [-z, x, -y],
  [-z, -y, -x],
  [-z, -x, y]
]

const rotateScanner = (s: Scanner) => $(s, map(rotations), zip) as Scanner[]

const findOverlap = (s1: Scanner, s2: Scanner) =>
  $(
    s2,
    map(c2 => $(s1, map(pipe(zipWith(c2), map(difference))))),
    map((d, i, arr) =>
      $(
        d,
        find(dd =>
          $(
            arr,
            filter((_, j) => j != i),
            some(some(arrEqual(dd)))
          )
        )
      )
    ),
    filter(nonNull),
    a => (a.length >= 12 ? { s: s2, d: a[0] } : null)
  )

const mergeScanners = (s1: Scanner, s2: Scanner, index: number) =>
  $(
    s2,
    rotateScanner,
    map((s2r, i) => findOverlap(s1, s2r)),
    filter(nonNull),
    first,
    result =>
      result && {
        foundAt: index,
        offset: result.d,
        merged: $(
          [
            ...s1,
            ...$(
              result.s,
              map(([x, y, z]) => [x + result.d[0], y + result.d[1], z + result.d[2]])
            )
          ],
          uniqueBy(JSON.stringify)
        )
      }
  )

const mergeAllScanners = (scanners: Scanner[]) =>
  $(
    loopUntil(
      (_, { beacons, notMergedYet, offsets }) => {
        const [__, { merged, foundAt, offset }] = $(
          notMergedYet,
          findWithContext((s, i) => {
            const result = mergeScanners(beacons, s, i)
            return result ? [true, result] : [false, null]
          })
        )
        notMergedYet.splice(foundAt, 1)
        return { beacons: merged, notMergedYet, offsets: [...offsets, offset] }
      },
      pipe(pluck('notMergedYet'), length, is(0)),
      {
        beacons: $(scanners, first),
        notMergedYet: $(scanners, slice(1)),
        offsets: []
      }
    )
  )

const merged = $(scanners, mergeAllScanners)

console.log('Part 1:', $(merged, pluck('beacons'), length))

console.log('Part 2:', $(merged, pluck('offsets'), uniquePermutations(2), map(pipe(zip, map(difference), sum)), max))
