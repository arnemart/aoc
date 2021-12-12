import {
  $,
  filter,
  gt,
  gte,
  is,
  length,
  loopUntil,
  map,
  match,
  md5,
  not,
  pipe,
  pluck,
  push,
  repeat,
  slice
} from '../../common'

type Triplet = { char: string; i: number }
type Result = { triplets: Triplet[]; confirmedTriplets: number[] }

const tripletReg = /(\w)\1\1/
const quintupletReg = /(\w)\1\1\1\1/

const doTheHashing = (str: string, hashFn: (s: string) => string) =>
  $(
    loopUntil(
      (i, { triplets, confirmedTriplets }) => {
        const hash = hashFn(`${str}${i}`)
        const tripletMatches = $(hash, match(tripletReg))
        if (tripletMatches) {
          const quintupletMatches = $(hash, match(quintupletReg))
          if (quintupletMatches) {
            triplets = $(triplets, filter(pipe(pluck('i'), gt(i - 1000))))
            confirmedTriplets = $(
              confirmedTriplets,
              push(
                $(
                  triplets,
                  filter(t => t.char == quintupletMatches[1]),
                  map(pluck('i'))
                )
              )
            )
            triplets = $(triplets, filter(pipe(pluck('char'), not(is(quintupletMatches[1])))))
          }
          triplets = $(
            triplets,
            push({
              char: tripletMatches[1],
              i
            })
          )
        }
        return { triplets, confirmedTriplets }
      },
      pipe(pluck('confirmedTriplets'), length, gte(64)),
      { triplets: [], confirmedTriplets: [] } as Result
    ),
    pluck('confirmedTriplets'),
    slice(60, 64)
  )

console.log('Part 1: probably one of these:', doTheHashing('qzyelonm', md5))
console.log('Part 2: probably one of these:', doTheHashing('qzyelonm', repeat(2017, md5)))
