import {
  $,
  add,
  difference,
  fillArray,
  first,
  ints,
  last,
  loopUntil,
  map,
  max,
  min,
  parse,
  pipe,
  printGrid,
  readInput,
  reduce,
  reverse,
  setIn,
  slice,
  split,
  sum,
  tee,
  zip,
  zipWith
} from '../../common'

type Point = [[number, number], [number, number]]
const points = $(
  readInput(),
  parse(/<\s*(.+?)>.+<\s*(.+?)>/, pipe(slice(1, 3), map(pipe(split(/,\s*/), ints))))
) as Point[]

const corners = (points: Point[]): [[number, number], [number, number]] =>
  $(points, map(first), tee(pipe(map(first), tee(max, min)), pipe(map(last), tee(max, min))))

const area = (points: Point[]): number => $(points, corners, map(difference), sum)

const step = (points: Point[]) => $(points, map(tee(pipe(zip, map(sum)), last))) as Point[]

const print = (points: Point[]) =>
  $(points, corners, c =>
    $(
      c,
      map(last),
      diff => $(points, map(pipe(first, zipWith(diff), map(difference)))),
      reduce(
        (grid, point) => $(grid, setIn($(point, reverse), 1)),
        fillArray($(c, map(pipe(difference, add(1)))) as [number, number])
      ),
      printGrid
    )
  )

const finalPoints = loopUntil(
  (steps, { nextPoints, nextArea }) =>
    $(nextPoints, step, newNextPoints => ({
      points: nextPoints,
      area: nextArea,
      nextPoints: newNextPoints,
      nextArea: area(newNextPoints),
      steps
    })),
  ({ area, nextArea }) => area < nextArea,
  {
    points,
    area: Infinity,
    nextPoints: points,
    nextArea: Infinity,
    steps: 0
  }
)

console.log('Part 1:\n')
$(finalPoints.points, print)

console.log('\nPart 2:', finalPoints.steps)
