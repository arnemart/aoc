import { $, cond, every, filter, find, int, is, keys, not, parse, pluck, readInput, spy } from '../../common'

type Sue = {
  number: number
  children?: number
  cats?: number
  samoyeds?: number
  pomeranians?: number
  akitas?: number
  vizslas?: number
  goldfish?: number
  trees?: number
  cars?: number
  perfumes?: number
}

type Key = keyof Sue

const scanResults: Sue = {
  number: -1,
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

const sues = $(
  readInput(),
  parse(/^Sue (\d+): (\w+): (\d+). (\w+): (\d+), (\w+): (\d+)$/, ([_, n, k1, v1, k2, v2, k3, v3]) => {
    const sue: Sue = { number: $(n, int) }
    sue[k1] = $(v1, int)
    sue[k2] = $(v2, int)
    sue[k3] = $(v3, int)
    return sue
  })
)

const valid1 = (key: Key, sue: Sue) => $(sue, pluck(key), is($(scanResults, pluck(key))))

const sueMatchesScan = (validator: (key: Key, sue: Sue) => boolean) => (sue: Sue) =>
  $(
    sue,
    keys,
    filter(not(is('number'))),
    every((key: Key) => validator(key, sue))
  )

console.log('Part 1:', $(sues, find(sueMatchesScan(valid1)), pluck('number')))

const valid2 = (key: Key, sue: Sue) => {
  const v1 = $(sue, pluck(key))
  const v2 = $(scanResults, pluck(key))
  return $(
    key,
    cond(
      [
        [['trees', 'cats'], v1 > v2],
        [['pomeranians', 'goldfish'], v1 < v2]
      ],
      v1 == v2
    )
  )
}

console.log('Part 1:', $(sues, find(sueMatchesScan(valid2)), pluck('number')))
