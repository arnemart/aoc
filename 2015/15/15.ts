import {
  $,
  clamp,
  filter,
  int,
  is,
  keys,
  last,
  map,
  max,
  parse,
  pipe,
  product,
  readInput,
  reduce,
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

const ingredients: { [name: string]: Ingredient } = $(
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
  ),
  reduce((ingrs, ingr) => {
    ingrs[ingr.name] = ingr
    return ingrs
  }, {})
)

const score = (ingrs: string[]) =>
  $(
    ['capacity', 'durability', 'flavor', 'texture'],
    map(q =>
      $(
        ingrs,
        map(ingr => ingredients[ingr][q]),
        sum,
        clamp(0, Infinity)
      )
    ),
    product
  )

const ingredientCombinations = $(ingredients, keys, uniqueCombinations(100))

console.log('Part 1:', $(ingredientCombinations, map(score), sortNumeric(), last))

const calories: (ingrs: string[]) => number = pipe(
  map(ingr => ingredients[ingr].calories),
  sum
)

console.log('Part 2:', $(ingredientCombinations, filter(pipe(calories, is(500))), map(score), max))
