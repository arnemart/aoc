import {
  $,
  count,
  filter,
  flatmap,
  getIn,
  is,
  join,
  leftPad,
  length,
  loopUntil,
  map,
  not,
  number,
  pipe,
  pluck,
  range,
  reduce,
  split,
  sum,
  toString,
  union
} from '../../common'
import { knothash } from '../10/knothash'

const input = 'xlqgujun'

const disk = $(
  range(128),
  map(
    pipe(n => `${input}-${n}`, knothash, split(), map(pipe(number(16), toString(2), leftPad(4, '0'))), join(), split())
  )
)

console.log('Part 1:', $(disk, map(count(is('1'))), sum))

const hash = join(',')

const neighbors = ([y, x]: number[]) =>
  $(
    [
      [y + 1, x],
      [y, x + 1],
      [y - 1, x],
      [y, x - 1]
    ],
    filter(([y, x]) => $(disk, getIn(y, x), is('1')))
  )

const findNeighborsRecursive = (p: number[], found: Set<string> = new Set()): Set<string> => {
  const hp = hash(p)
  if (found.has(hp)) {
    return found
  } else {
    found.add(hp)
    return $(
      p,
      neighbors,
      reduce((found, n) => findNeighborsRecursive(n, found), found)
    )
  }
}

const allCoords = $(
  range(128),
  flatmap(y =>
    $(
      range(128),
      map(x => [y, x])
    )
  ),
  filter(([y, x]) => $(disk, getIn(y, x), is('1')))
)

const groups = loopUntil(
  (_, { coords, groups, masterGroup }) => {
    const group = findNeighborsRecursive(coords[0])
    const newMasterGroup = $([masterGroup, group], union)
    return {
      groups: [...groups, group],
      coords: $(coords, filter(not(c => newMasterGroup.has(hash(c))))),
      masterGroup: newMasterGroup
    }
  },
  pipe(pluck('coords'), length, is(0)),
  { coords: allCoords, groups: [] as Set<string>[], masterGroup: new Set<string>() }
).groups

console.log('Part 2:', groups.length)
