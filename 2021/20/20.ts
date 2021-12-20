import {
  $,
  combinations,
  cond,
  count,
  fillArray,
  first,
  flatten,
  getInDefault,
  is,
  join,
  last,
  lines,
  map,
  number,
  pipe,
  range,
  readInput,
  reduce,
  reverse,
  split,
  tee
} from '../../common'

type Image = number[][]

const [algorithm, image] = $(
  readInput(),
  split('\n\n'),
  tee(pipe(first, split(), map(cond([['#', 1]], 0))), pipe(last, lines, map(pipe(split(), map(cond([['#', 1]], 0))))))
) as [number[], Image]

const enhancePixel = (y: number, x: number, def: number) => (img: Image) =>
  $(
    [1, 0, -1],
    combinations(2),
    reverse,
    map(([yd, xd]) => [y + yd, x + xd]),
    map(c => $(img, getInDefault(c, def))),
    join(),
    number(2),
    n => algorithm[n]
  )

const expand =
  (def: number) =>
  (img: Image): Image =>
    [
      fillArray(img[0].length + 2, def),
      ...$(
        img,
        map(row => [def, ...row, def])
      ),
      fillArray(img[0].length + 2, def)
    ]

const sharpen =
  (def: number) =>
  (img: Image): Image =>
    $(
      range(img.length),
      map(y =>
        $(
          range(img[0].length),
          map(x => $(img, enhancePixel(y, x, def)))
        )
      )
    )

const enhance = (times: number) => (img: Image) =>
  $(
    range(times),
    reduce((img, i) => $(img, expand(i % 2), sharpen(i % 2)), img)
  )

const countLitPixels = (img: Image) => $(img, flatten(), count(is(1)))

console.log('Part 1:', $(image, enhance(2), countLitPixels))

console.log('Part 1:', $(image, enhance(50), countLitPixels))
