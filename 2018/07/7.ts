import {
  $,
  fillArray,
  filter,
  find,
  first,
  flatten,
  is,
  isIn,
  join,
  last,
  length,
  loopUntil,
  not,
  parse,
  pipe,
  pluck,
  push,
  readInput,
  reduce,
  some,
  sort,
  unique,
  without
} from '../../common'

const allDeps = $(
  readInput(),
  parse(/Step (\w) .+ step (\w)/, ([_, a, b]) => [a, b])
)

const allTasks = $(allDeps, flatten(), unique, sort())

const findNextTask = (remaining: string[], finished: string[]) =>
  $(
    remaining,
    find(s => $(allDeps, filter(pipe(first, not(isIn(finished)))), not(some(pipe(last, is(s))))))
  )

const serialTasks = loopUntil(
  (_, { finished, remaining }) =>
    $(findNextTask(remaining, finished), nextTask => ({
      finished: $(finished, push(nextTask)),
      remaining: $(remaining, without(nextTask))
    })),
  pipe(pluck('remaining'), length, is(0)),
  {
    finished: [],
    remaining: allTasks
  }
).finished

console.log('Part 1:', $(serialTasks, join()))

const time = (task: string) => task.charCodeAt(0) - 4

const parallellTasks = loopUntil(
  (_, state) => ({
    elapsedTime: state.elapsedTime + 1,
    ...$(
      state.elves,
      reduce(
        ({ elves, finished }, elf) =>
          elf.remainingTime == 1
            ? {
                elves: [...elves, { currentTask: null, remainingTime: 0 }],
                finished: [...finished, elf.currentTask]
              }
            : {
                elves: [...elves, { ...elf, remainingTime: elf.remainingTime - 1 }],
                finished
              },
        { elves: [], finished: state.finished }
      ),
      ({ elves, finished }) =>
        $(
          elves,
          reduce(
            ({ elves, remaining }, elf) =>
              elf.currentTask == null
                ? $(findNextTask(remaining, finished), nextTask =>
                    nextTask
                      ? {
                          elves: [...elves, { currentTask: nextTask, remainingTime: time(nextTask) }],
                          remaining: $(remaining, without(nextTask))
                        }
                      : { elves: [...elves, elf], remaining }
                  )
                : { elves: [...elves, elf], remaining },
            { elves: [], remaining: state.remaining }
          ),
          ({ elves, remaining }) => ({ elves, finished, remaining })
        )
    )
  }),

  pipe(pluck('finished'), length, is(allTasks.length)),

  {
    elves: fillArray(5, {
      currentTask: null,
      remainingTime: 0
    }),
    elapsedTime: -1,
    finished: [],
    remaining: allTasks
  }
)

console.log('Part 2:', parallellTasks.elapsedTime)
