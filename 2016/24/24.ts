import {
  $,
  abs,
  arrEqual,
  filter,
  forEach,
  id,
  join,
  lines,
  map,
  max,
  min,
  numeric,
  permutations,
  pipe,
  push,
  range,
  readInput,
  reduce,
  slice,
  split,
  sum,
  tee,
  unshift,
  zip
} from '../../common'
import aStar = require('a-star')

const ducts = $(readInput(), lines, map(split()))

const locations: number[][] = $(
  ducts,
  reduce((l, row, y) => {
    $(
      row,
      forEach((v, x) => {
        if (numeric(v)) {
          l[v] = [y, x]
        }
      })
    )
    return l
  }, [])
)

const findNeighbors = ([y, x]) =>
  $(
    [
      [y + 1, x],
      [y, x + 1],
      [y - 1, x],
      [y, x - 1]
    ],
    filter(([y, x]) => ducts[y][x] != '#')
  )

const distanceCache: Map<string, number> = new Map()
const distance = ([p1, p2]: number[]) => {
  const key = `${min([p1, p2])},${max([p1, p2])}`
  if (!distanceCache.has(key)) {
    distanceCache.set(
      key,
      aStar({
        start: locations[p1],
        isEnd: arrEqual(locations[p2]),
        neighbor: findNeighbors,
        distance: () => 1,
        heuristic: ([x, y]) => abs(locations[p2][0] - x) + abs(locations[p2][1] - y),
        hash: join(',')
      }).cost
    )
  }
  return distanceCache.get(key)
}

console.log(
  'Part 1:',
  $(
    range(1, locations.length),
    permutations(),
    map(pipe(tee(pipe(unshift(0), slice(0, -1)), id), zip, map(distance), sum)),
    min
  )
)

console.log(
  'Part 2:',
  $(range(1, locations.length), permutations(), map(pipe(tee(unshift(0), push(0)), zip, map(distance), sum)), min)
)
