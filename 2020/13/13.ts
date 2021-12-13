import { $, filter, ints, lines, map, readInput, sort, split } from '../../common'

const input = $(readInput(), lines)

const departureTime = parseInt(input[0])
const buses1 = $(
  input[1],
  split(','),
  filter(v => v != 'x'),
  ints,
  map(b => ({ number: b, wait: b - (departureTime % b) })),
  sort((a, b) => a.wait - b.wait)
)

console.log('Part 1:', buses1[0].number * buses1[0].wait)

type Bus = { n: number; i: number; f: number }

const buses2: Bus[] = $(
  input[1],
  split(','),
  ints,
  map((n, i) => ({ n, i, f: Math.pow(i, n - 1) - i })),
  filter(b => !isNaN(b.n)),
  sort((a, b) => b.n - a.n)
)

/*













































































hot garbage alert
*/

const findTimestamp2 = (buses: Bus[]): number => {
  const busCount = buses.length
  const step = buses[0].n
  let timestamp = step - buses[0].i
  let steps = 0
  outer: while (true) {
    timestamp += step
    steps++
    if (steps % 100000000 == 0) {
      console.log(steps, timestamp)
    }
    for (let i = 1; i < busCount; i++) {
      if ((timestamp + buses[i].i) % buses[i].n != 0) {
        continue outer
      }
    }
    return timestamp
  }
}

console.log('Part 2:', findTimestamp2(buses2))
