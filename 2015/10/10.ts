import { $, charAt, join, length, map, pluck, reduce, repeat, slice, split } from '../../common'

const input = '1113122113'

type Run = {
  char: string
  count: number
}

const step = (input: string) =>
  $(
    input + 'ä',
    split(),
    slice(1),
    reduce(
      (state, char) => {
        if (char == state.currentChar) {
          state.currentRun++
        } else {
          state.runs.push({ char: state.currentChar, count: state.currentRun })
          state.currentChar = char
          state.currentRun = 1
        }
        return state
      },
      {
        currentChar: $(input, charAt(0)),
        currentRun: 1,
        runs: [] as Run[]
      }
    ),
    pluck('runs'),
    map(run => `${run.count}${run.char}`),
    join()
  )

console.log('Part 1:', $(input, repeat(40, step), length))
console.log('Part 2:', $(input, repeat(50, step), length))
