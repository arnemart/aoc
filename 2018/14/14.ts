import {
  $,
  cond,
  digits,
  gte,
  is,
  join,
  last,
  length,
  loopUntil,
  map,
  pipe,
  pluck,
  slice,
  subtract,
  sum,
  toString
} from '../../common'

const input = 919901

const initialState = {
  recipes: [3, 7],
  elves: [0, 1]
}

const step = ({ recipes, elves }: typeof initialState) =>
  $(recipes, pluck(elves), sum, digits, ([r1, r2]) => {
    recipes.push(r1)
    r2 != null && recipes.push(r2)
    return {
      recipes,
      elves: $(
        elves,
        map(elf => (elf + recipes[elf] + 1) % recipes.length)
      )
    }
  })

const aLotOfRecipes = loopUntil((_, state) => step(state), pipe(pluck('recipes'), length, gte(input + 10)), initialState)

console.log('Part 1:', $(aLotOfRecipes.recipes, slice(input, input + 10), join()))

const inputStr = $(input, toString())
const inputLastDigit = input % 10
const inputLength = inputStr.length

const evenMoreRecipes = loopUntil(
  (_, state) => step(state),
  ({ recipes }) =>
    (recipes[recipes.length - 1] == inputLastDigit && $(recipes, slice(-inputLength), join(), is(inputStr))) ||
    (recipes[recipes.length - 2] == inputLastDigit && $(recipes, slice(-(inputLength + 1), -1), join(), is(inputStr))),
  aLotOfRecipes
)

console.log(
  'Part 2:',
  $(evenMoreRecipes.recipes, length, subtract($(evenMoreRecipes.recipes, last, cond([[inputLastDigit, 6]], 7))))
)
