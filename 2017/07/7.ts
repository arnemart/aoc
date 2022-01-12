import {
  $,
  add,
  allEqual,
  filter,
  find,
  flatmap,
  indexOf,
  int,
  isIn,
  leastCommon,
  map,
  min,
  mostCommon,
  not,
  parse,
  pipe,
  pluck,
  pluckFrom,
  readInput,
  split,
  sum
} from '../../common'

type Program = {
  name: string
  weight: number
  children: string[]
}
const programs = $(
  readInput(),
  parse(/^(\w+) \((\d+)\)( -> (.+))?/, ([_, name, w, __, c]) => ({
    name,
    weight: int(w),
    children: c ? $(c, split(', ')) : []
  }))
)

const bottomProgram = $(programs, map(pluck('name')), find(not(isIn($(programs, flatmap(pluck('children')))))))

console.log('Part 1:', bottomProgram)

const programMap = $(
  programs,
  map(p => [p.name, p] as [string, Program]),
  e => new Map(e)
)

const weight = (p: string) => $(programMap.get(p).weight, add($(programMap.get(p).children, map(weight), sum)))

const unbalanced = $(
  programs,
  map(p => ({ ...p, childrenWeights: $(p, pluck('children'), map(weight)) })),
  filter(pipe(pluck('childrenWeights'), not(allEqual))),
  map(({ children, childrenWeights }) =>
    $(
      childrenWeights,
      indexOf($(childrenWeights, leastCommon)),
      pluckFrom(children),
      c => programMap.get(c),
      pluck('weight'),
      add($(childrenWeights, mostCommon) - $(childrenWeights, leastCommon))
    )
  ),
  min
)

console.log('Part 2:', unbalanced)
