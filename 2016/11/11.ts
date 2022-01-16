import aStar from '../../astar'
import {
  $,
  clone,
  every,
  filter,
  flatten,
  includes,
  is,
  isNull,
  join,
  length,
  lines,
  map,
  matchAll,
  mult,
  not,
  nth,
  overlap,
  pipe,
  pluck,
  push,
  readInput,
  slice,
  sort,
  sum,
  tee,
  uniquePermutations,
  within,
  without
} from '../../common'

type Loadout = {
  chips: string[]
  rtgs: string[]
}
type ChipLab = {
  elevator: number
  floors: Loadout[]
  moves: number
}

const getChipLab = (input: string): ChipLab => ({
  elevator: 0,
  moves: 0,
  floors: $(
    input,
    lines,
    map(
      pipe(matchAll(/(\w+)-compatible microchip|(\w+) generator/g), matches => ({
        chips: $(matches, map(nth(1)), filter(not(isNull)), sort()),
        rtgs: $(matches, map(nth(2)), filter(not(isNull)), sort())
      }))
    )
  )
})

const done = ({ floors }: ChipLab) =>
  $(floors, slice(0, -1), every(pipe(pluck(['chips', 'rtgs']), every(pipe(length, is(0))))))

const loadouts = (l: Loadout): Loadout[] =>
  $(
    l,
    tee(
      pipe(
        pluck('chips'),
        map(chip => ({ chips: [chip], rtgs: [] }))
      ),
      pipe(
        pluck('rtgs'),
        map(rtg => ({ chips: [], rtgs: [rtg] }))
      ),
      pipe(
        pluck('chips'),
        uniquePermutations(2),
        map(chips => ({ chips, rtgs: [] }))
      ),
      pipe(
        pluck('rtgs'),
        uniquePermutations(2),
        map(rtgs => ({ chips: [], rtgs }))
      ),
      pipe(
        pluck(['chips', 'rtgs']),
        ([c, r]) => $(c, overlap(r)),
        map(both => ({ chips: [both], rtgs: [both] }))
      )
    ),
    flatten()
  )

const addLoadout =
  (add: Loadout) =>
  (to: Loadout): Loadout => ({
    chips: $([...to.chips, ...add.chips], sort()),
    rtgs: $([...to.rtgs, ...add.rtgs], sort())
  })

const removeLoadout =
  (remove: Loadout) =>
  (from: Loadout): Loadout => ({
    chips: $(from.chips, without(remove.chips), sort()),
    rtgs: $(from.rtgs, without(remove.rtgs), sort())
  })

const hash = (lab: ChipLab) =>
  `${lab.elevator}-${$(
    lab.floors,
    map(floor => `${$(floor.chips, join(','))};${$(floor.rtgs, join(','))}`),
    join('|')
  )}`

const seenStates = new Set<string>()
const notSeenYet = (lab: ChipLab) => {
  const labstr = hash(lab)
  const seen = seenStates.has(labstr)
  if (!seen) {
    seenStates.add(labstr)
  }
  return !seen
}

const invalidLoadouts = (lab: ChipLab, fromFloor: number, toFloor: number) => (loadout: Loadout) =>
  // All the chips we are bringing have a corresponding rtg
  ((lab.floors[toFloor].rtgs.length == 0 && loadout.rtgs.length == 0) ||
    $(
      loadout.chips,
      every(chip => $(lab.floors[toFloor].rtgs, push(loadout.rtgs), includes(chip)))
    )) &&
  // The rtgs we are bringing won't destroy any chips
  (loadout.rtgs.length == 0 ||
    $(
      lab.floors[toFloor].chips,
      every(chip => $(lab.floors[toFloor].rtgs, push(loadout.rtgs), includes(chip)))
    )) &&
  // The chips we are leaving behind won't be destroyed
  (lab.floors[fromFloor].rtgs.length == loadout.rtgs.length ||
    $(
      lab.floors[fromFloor].chips,
      without(loadout.chips),
      every(chip => $(lab.floors[fromFloor].rtgs, without(loadout.rtgs), includes(chip)))
    ))

const validMoves = (lab: ChipLab) =>
  $(lab.floors[lab.elevator], loadouts, loadouts =>
    $(
      [lab.elevator - 1, lab.elevator + 1],
      filter(within(0, 3)),
      map(newFloor =>
        $(
          loadouts,
          filter(invalidLoadouts(lab, lab.elevator, newFloor)),
          map(loadout => {
            const newLab = clone(lab) as ChipLab
            newLab.floors[newFloor] = addLoadout(loadout)(newLab.floors[newFloor])
            newLab.floors[lab.elevator] = removeLoadout(loadout)(newLab.floors[lab.elevator])
            newLab.elevator = newFloor
            newLab.moves = newLab.moves + 1
            return newLab
          }),
          filter(notSeenYet)
        )
      ),
      flatten()
    )
  ) as ChipLab[]

const moveAllTheThings = (input: string) =>
  aStar({
    start: getChipLab(input),
    isEnd: done,
    neighbors: validMoves,
    heuristic: ({ floors }: ChipLab) =>
      $(
        floors,
        slice(0, -1),
        map((f, i) => $(f, pluck(['chips', 'rtgs']), map(length), sum, mult(6 - i))),
        sum
      ),
    hash: hash
  })

const weFoundSomeMoreStuff =
  'An elerium generator, an elerium-compatible microchip, a dilithium generator, a dilithium-compatible microchip'

console.log('Part 1:', $(moveAllTheThings(readInput()), pluck('cost')))

console.log('Part 2:', $(moveAllTheThings(weFoundSomeMoreStuff + readInput()), pluck('cost')))
