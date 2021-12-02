import {
  $,
  clamp,
  filter,
  int,
  is,
  last,
  map,
  max,
  parse,
  pipe,
  pluck,
  product,
  readInput,
  sortNumeric,
  sum,
  uniqueCombinations
} from '../../common'

type Ingredient = {
  name: string
  capacity: number
  durability: number
  flavor: number
  texture: number
  calories: number
}

const ingredients: Ingredient[] = $(
  readInput(),
  parse(
    /^(\w+): \w+ (-?\d+), \w+ (-?\d+), \w+ (-?\d+), \w+ (-?\d+), \w+ (-?\d+)$/,
    ([_, name, cap, dur, fla, tex, cal]) => ({
      name,
      capacity: $(cap, int),
      durability: $(dur, int),
      flavor: $(fla, int),
      texture: $(tex, int),
      calories: $(cal, int)
    })
  )
)

const score = (ingrs: Ingredient[]) =>
  $(
    ['capacity', 'durability', 'flavor', 'texture'] as (keyof Ingredient)[],
    map(q => $(ingrs, map(pluck(q)), sum, clamp(0, Infinity))),
    product
  )

const ingredientCombinations = $(ingredients, uniqueCombinations(100))

console.log('Part 1:', $(ingredientCombinations, map(score), sortNumeric(), last))

const calories: (ingrs: Ingredient[]) => number = pipe(map(pluck('calories')), sum)

console.log('Part 2:', $(ingredientCombinations, filter(pipe(calories, is(500))), map(score), max))
