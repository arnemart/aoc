import { $, add, clone, ints, lines, loopUntil, pluck, readInput, set } from '../../common'

const jumps = $(readInput(), lines, ints)

type State = {
  pc: number
  steps: number
  jumps: number[]
}

const step = ({ pc, jumps, steps }: State): State => ({
  pc: pc + jumps[pc],
  steps: steps + 1,
  jumps: $(jumps, set(pc, add(1)))
})

const countSteps = (stepFn: (s: State) => State) =>
  $(
    loopUntil(
      (_, state) => stepFn(state),
      ({ pc, jumps }) => pc >= jumps.length,
      { pc: 0, steps: 0, jumps: clone(jumps) }
    ),
    pluck('steps')
  )

console.log('Part 1:', $(step, countSteps))

const step2 = ({ pc, jumps, steps }: State): State => ({
  pc: pc + jumps[pc],
  steps: steps + 1,
  jumps: $(jumps, set(pc, add(jumps[pc] >= 3 ? -1 : 1)))
})

console.log('Part 2:', $(step2, countSteps))
