import {
  $,
  add,
  combinations,
  createCache,
  first,
  frequencies,
  gte,
  last,
  loopUntil,
  map,
  max,
  min,
  mult,
  pipe,
  pluck,
  reduce,
  spy,
  sum,
  tee
} from '../../common'

const p1start = 3
const p2start = 10

let deterministicDie = 1
const roll1 = () => deterministicDie++

console.log(
  'Part 1:',
  $(
    loopUntil(
      (i, ps) =>
        $(
          ps,
          map((p, j) => {
            if (i % 2 == j % 2) {
              const newPos = (p.p + roll1() + roll1() + roll1()) % 10
              return { p: newPos, s: p.s + newPos + 1 }
            } else {
              return p
            }
          })
        ),
      ([p1, p2]) => p1.s >= 1000 || p2.s >= 1000,
      [
        { p: p1start - 1, s: 0 },
        { p: p2start - 1, s: 0 }
      ]
    ),
    map(pluck('s')),
    min,
    mult(roll1() - 1)
  )
)

const rolls = $([1, 2, 3], combinations(3), map(sum), frequencies)
const rollValues = $(rolls, r => Array.from(r.keys()))

const initialState = {
  p1score: 0,
  p2score: 0,
  p1LastRoll: 0,
  p2LastRoll: 0,
  p1pos: 4 - 1,
  p2pos: 8 - 1
}

const cache = createCache<string, number[]>()
const playRecursive = (state: typeof initialState, whosTurn = 0): number[] =>
  cache(`${state.p1score},${state.p2score},${state.p1pos},${state.p2pos}`, () =>
    whosTurn == 0
      ? $(
          rollValues,
          map(roll => {
            const newPos = (state.p1pos + roll) % 10
            return {
              ...state,
              p1LastRoll: roll,
              p1pos: newPos,
              p1score: state.p1score + newPos + 1
            }
          }),
          reduce(
            ([p1wins, p2wins], state) =>
              $(state, pluck('p1score'), gte(21))
                ? [p1wins + rolls.get(state.p1LastRoll), p2wins]
                : $(
                    playRecursive(state, 1),
                    map(mult(rolls.get(state.p1LastRoll))),
                    tee(pipe(first, add(p1wins)), pipe(last, add(p2wins)))
                  ),
            [0, 0]
          )
        )
      : $(
          rollValues,
          map(roll => {
            const newPos = (state.p2pos + roll) % 10
            return {
              ...state,
              p2LastRoll: roll,
              p2pos: newPos,
              p2score: state.p2score + newPos + 1
            }
          }),
          reduce(
            ([p1wins, p2wins], state) =>
              $(state, pluck('p2score'), gte(21))
                ? [p1wins, p2wins + rolls.get(state.p2LastRoll)]
                : $(
                    playRecursive(state, 0),
                    map(mult(rolls.get(state.p2LastRoll))),
                    tee(pipe(first, add(p1wins)), pipe(last, add(p2wins)))
                  ),
            [0, 0]
          )
        )
  )

console.log('Part 2:', $(initialState, playRecursive, max))

/*
444356092776315 
341960390180808
307571216519574
*/
