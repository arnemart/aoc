import {
  $,
  count,
  every,
  filter,
  flatten,
  intoSet,
  join,
  keys,
  map,
  parse,
  pluck,
  readInput,
  reduce,
  some,
  sort,
  split,
  sum,
  values
} from '../../common'

const inputReg = /^(.+) \(contains (.+)\)/
const input = $(
  readInput(),
  parse(inputReg, ([_, ingredients, allergens]) => ({
    ingredients: $(ingredients, split(' ')),
    allergens: $(allergens, split(', '))
  }))
)

const allUnique =
  (what: string) =>
  (input: { [key: string]: string[] }[]): string[] =>
    $(input, map(pluck(what)), flatten(), intoSet, values)

const allIngredients = $(input, allUnique('ingredients'))
const allAllergens = $(input, allUnique('allergens'))

type Matches = { [allergen: string]: string[] }

const possibleMatches: Matches = $(
  allAllergens,
  reduce(
    (matches, allergen) => ({
      ...matches,
      [allergen]: $(
        input,
        filter(line => line.allergens.includes(allergen)),
        linesWithAll =>
          $(
            linesWithAll,
            allUnique('ingredients'),
            filter(i =>
              $(
                linesWithAll,
                every(line => line.ingredients.includes(i))
              )
            )
          )
      )
    }),
    {}
  )
)

const ingredientsWithoutAllergens = $(
  allIngredients,
  filter(i => !$(possibleMatches, values, flatten(), intoSet, s => s.has(i)))
)

console.log(
  'Part 1:',
  $(
    ingredientsWithoutAllergens,
    map(i =>
      $(
        input,
        count(line => line.ingredients.includes(i))
      )
    ),
    sum
  )
)

const filterOutIngredients = (matches: Matches): Matches =>
  $(
    matches,
    values,
    every(v => v.length == 1)
  )
    ? matches
    : $(
        matches,
        keys,
        reduce(
          (m, allergen) => ({
            ...m,
            [allergen]:
              matches[allergen].length == 1
                ? matches[allergen]
                : $(
                    matches[allergen],
                    filter(
                      ingredient =>
                        !$(
                          matches,
                          keys,
                          some(a => a != allergen && matches[a].length == 1 && matches[a][0] == ingredient)
                        )
                    )
                  )
          }),
          {}
        ),
        filterOutIngredients
      )

const matches = $(possibleMatches, filterOutIngredients)

console.log(
  'Part 2:',
  $(
    matches,
    keys,
    sort(),
    map(allergen => matches[allergen][0]),
    join(',')
  )
)
