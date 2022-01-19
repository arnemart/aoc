import {
  $,
  combine,
  createCache,
  fillArray,
  flatmap,
  floor,
  id,
  join,
  last,
  map,
  nth,
  pluck,
  range,
  slice,
  sortBy,
  sum,
  tee
} from '../../common'

const serialNo = 8199

const powerLevel = (y: number, x: number) => (floor((((x + 11) * (y + 1) + serialNo) * (x + 11)) / 100) % 10) - 5

const grid = fillArray([300, 300], powerLevel)

type Sum = { x: number; y: number; size: number; sum: number }

const gridSumCache = createCache<number, Sum>()
const gridSum =
  (size: number) =>
  ([y, x]: number[]): Sum => {
    const key = y * 1000000 + x * 1000 + size
    return gridSumCache(key, () =>
      $(
        gridSumCache(key - 1, () =>
          $(grid, slice(y, y + size - 1), flatmap(slice(x, x + size - 1)), sum, s => ({
            x: x + 1,
            y: y + 1,
            size: size - 1,
            sum: s
          }))
        ),
        oneSmaller => ({
          x: oneSmaller.x,
          y: oneSmaller.y,
          size,
          sum:
            oneSmaller.sum +
            $(grid, nth(y + size - 1), slice(x, x + size), sum) +
            $(grid, slice(y, y + size - 1), map(nth(x + size - 1)), sum)
        })
      )
    )
  }

const findSums = (sizes: number[]) =>
  $(
    sizes,
    flatmap(size => $(range(0, 300 - size), tee(id, id), combine, map(gridSum(size)))),
    sortBy(pluck('sum'))
  )

console.log('Part 1:', $(findSums([3]), last, pluck(['x', 'y']), join(',')))

console.log('Part 2:', $(findSums(range(3, 100)), last, pluck(['x', 'y', 'size']), join(',')))
