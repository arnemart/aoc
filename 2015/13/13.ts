import {
  $,
  cond,
  filter,
  flatten,
  int,
  intoSet,
  is,
  lines,
  map,
  match,
  max,
  permutations,
  pipe,
  pluck,
  readInput,
  shift,
  sum,
  values,
  zipWith
} from '../../common'

type Rule = {
  person1: string
  happiness: number
  person2: string
}

const input = $(
  readInput(),
  lines,
  map(match(/^(\w+) .+ (gain|lose) (\d+) .+ to (\w+)\.$/)),
  map(
    matches =>
      ({
        person1: matches[1],
        happiness:
          $(matches[3], int) *
          $(
            matches[2],
            cond([
              ['gain', 1],
              ['lose', -1]
            ])
          ),
        person2: matches[4]
      } as Rule)
  )
)

const peoplePermutations = (rules: Rule[]) =>
  $(
    rules,
    map(r => [r.person1, r.person2]),
    flatten(),
    intoSet,
    values,
    permutations()
  )

const triples = (people: string[]): [string, string, string][] =>
  $(people, zipWith($(people, shift(-1)), $(people, shift(1))))

const calculateHappiness =
  (rules: Rule[]) =>
  ([p1, p2, p3]: string[]): number =>
    $(
      rules,
      filter(rule => $(rule.person1, is(p1)) && $(rule.person2, is(p2, p3))),
      map(pluck('happiness')),
      sum
    )

const solve = (rules: Rule[]) =>
  $(rules, peoplePermutations, map(pipe(triples, map(calculateHappiness(rules)), sum)), max)

console.log('Part 1:', $(input, solve))

const input2 = [...input, { person1: 'Myself', person2: 'Alice', happiness: 0 }]

console.log('Part 2:', $(input2, solve))
