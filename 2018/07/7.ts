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

const deps = $(
  readInput(),
  parse(/Step (\w) .+ step (\w)/, ([_, a, b]) => [a, b])
)

const tasks = $(deps, flatten(), unique, sort())

const findNextTask = (remaining: string[], finished: string[]) =>
  $(
    remaining,
    find(s => $(deps, filter(pipe(first, not(isIn(finished)))), not(some(pipe(last, is(s))))))
  )

const serialElves = loopUntil(
  (_, { finished, remaining }) =>
    $(findNextTask(remaining, finished), nextTask => ({
      finished: $(finished, push(nextTask)),
      remaining: $(remaining, without(nextTask))
    })),
  pipe(pluck('remaining'), length, is(0)),
  {
    finished: [],
    remaining: tasks
  }
).finished

console.log('Part 1:', $(serialElves, join()))

const time = (task: string) => task.charCodeAt(0) - 4
const elf = (currentTask: string = null, remainingTime = 0) => ({ currentTask, remainingTime })

const parallellElves = loopUntil(
  (_, { elves, elapsedTime, finished, remaining }) => ({
    elapsedTime: elapsedTime + 1,
    ...$(
      elves,
      reduce(
        ({ elves, finished }, e) =>
          e.remainingTime == 1
            ? { elves: [...elves, elf()], finished: [...finished, e.currentTask] }
            : { elves: [...elves, elf(e.currentTask, e.remainingTime - 1)], finished },
        { elves: [], finished: finished }
      ),
      ({ elves, finished }) =>
        $(
          elves,
          reduce(
            ({ elves, remaining }, e) =>
              e.currentTask == null
                ? $(findNextTask(remaining, finished), nextTask =>
                    nextTask
                      ? { elves: [...elves, elf(nextTask, time(nextTask))], remaining: $(remaining, without(nextTask)) }
                      : { elves: [...elves, e], remaining }
                  )
                : { elves: [...elves, e], remaining },
            { elves: [], remaining: remaining }
          ),
          ({ elves, remaining }) => ({ elves, finished, remaining })
        )
    )
  }),

  pipe(pluck('finished'), length, is(tasks.length)),

  {
    elves: fillArray(5, elf()),
    elapsedTime: -1,
    finished: [],
    remaining: tasks
  }
)

console.log('Part 2:', parallellElves.elapsedTime)
