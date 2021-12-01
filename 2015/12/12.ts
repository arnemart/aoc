import { $, cond, entries, flatten, is, keys, map, readInput, reduce, some, sum, values } from '../../common'

const input = $(readInput(), JSON.parse)

const findNumbers = (o: any): number[] =>
  $(
    o,
    keys,
    map(key =>
      $(
        typeof o[key],
        cond(
          [
            ['number', o[key]],
            ['object', () => $(o[key], findNumbers)]
          ],
          0
        )
      )
    ),
    flatten()
  )

console.log('Part 1:', $(input, findNumbers, sum))

const hasRed = (o: { [key: string]: any }): boolean => $(o, values, some(is('red')))

const stripRed = (o: any): any => {
  if (o instanceof Array) {
    return $(o, map(stripRed))
  } else if (o instanceof Object) {
    return hasRed(o)
      ? {}
      : $(
          o,
          entries,
          reduce((obj, [key, value]) => {
            obj[key] = stripRed(value)
            return obj
          }, {})
        )
  } else {
    return o
  }
}

console.log('Part 2:', $(input, stripRed, findNumbers, sum))
