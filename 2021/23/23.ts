import aStar from '../../astar'
import {
  $,
  cond,
  every,
  fillArray,
  filter,
  flatmap,
  floor,
  inclusiveRange,
  is,
  join,
  length,
  map,
  mult,
  pluckFrom,
  range,
  set,
  slice,
  split,
  sum
} from '../../common'

/*

 Part 1:
 8 9 10 11 12 13 14 15 16 17 18
      1     3     5     7   
      0     2     4     6 

 Part 2:
 16 17 18 19 20 21 22 23 24 25 26
        3     7    11    15
        2     6    10    14
        1     5     9    13   
        0     4     8    12 

*/

type Part = 1 | 2

const costs = { A: 1, B: 10, C: 100, D: 1000 }

const buildHomes = (count: number) =>
  $(
    'ABCD',
    split(),
    flatmap(a => fillArray(count, a))
  )
const homes = { 1: buildHomes(2), 2: buildHomes(4) }
const bottomHome = { 1: { A: 0, B: 2, C: 4, D: 6 }, 2: { A: 0, B: 4, C: 8, D: 12 } }

const siderooms = { 1: range(8), 2: range(16) }
const crossroads = { 1: [10, 12, 14, 16], 2: [18, 20, 22, 24] }
const hallways = { 1: [8, 9, 11, 13, 15, 17, 18], 2: [16, 17, 19, 21, 23, 25, 26] }

const bottom = (room: number, part: Part) => floor(room / (part * 2)) * part * 2
const top = (room: number, part: Part) => bottom(room, part) + (part == 1 ? 1 : 3)
const crossroad = (room: number, part: Part) =>
  part == 1 ? bottom(room, part) + 10 : bottom(room, part) + (20 - (bottom(room, part) / 4 + 1) * 2)

const route = (from: number, to: number, part: Part): number[] =>
  $(
    from,
    cond(
      [
        // From a side room
        [siderooms[part], () => [...inclusiveRange(from, top(from, part)), ...route(crossroad(from, part), to, part)]],
        // From a crossroad
        [
          crossroads[part],
          () =>
            $(
              to,
              cond(
                // ...to a side room
                [
                  [
                    siderooms[part],
                    () => [...inclusiveRange(from, crossroad(to, part)), ...inclusiveRange(top(to, part), to)]
                  ]
                ],
                // ...to another hallway space
                () => inclusiveRange(from, to)
              )
            )
        ]
      ],
      // From a hallway space
      () =>
        $(
          to,
          cond(
            // ...to a side room
            [
              [
                siderooms[part],
                () => [
                  ...inclusiveRange(from, crossroad(to, part)),
                  ...$(route(crossroad(to, part), to, part), slice(1))
                ]
              ]
            ],
            // ...to another hallway space
            () => inclusiveRange(from, to)
          )
        )
    )
  )

const calculateCost = (from: number, to: number, type: string, part: Part) =>
  $(
    type,
    cond([['.', 0]], () => $(route(from, to, part), slice(1), length, mult(costs[type])))
  )

const buildValidMoves = (part: Part): number[][] =>
  $(
    siderooms[part],
    flatmap(p1 =>
      $(
        hallways[part],
        flatmap(p2 => [
          [p1, p2],
          [p2, p1]
        ])
      )
    )
  )

const validMoves = { 1: buildValidMoves(1), 2: buildValidMoves(2) }

const allowedToMoveHere = (from: number, to: number, rooms: string[], part: Part) =>
  $(
    to,
    cond(
      [
        [
          siderooms[part],
          rooms[from] == homes[part][to] &&
            $(inclusiveRange(to, bottom(to, part)), slice(1), map(pluckFrom(rooms)), every(is(homes[part][to])))
        ]
      ],
      true
    )
  )

const inTheCorrectSpot = (p: number, rooms: string[], part: Part) =>
  $(
    p,
    cond(
      [[siderooms[part], $(inclusiveRange(bottom(p, part), p), map(pluckFrom(rooms)), every(is(homes[part][p])))]],
      false
    )
  )

type State = {
  cost: number
  rooms: string[]
}

const whereGo =
  (part: Part) =>
  ({ rooms }: State): State[] =>
    $(
      validMoves[part],
      filter(
        ([from, to]) =>
          // Only move an amphipod into an empty space
          rooms[from] != '.' &&
          rooms[to] == '.' &&
          // Only move into the correct rooms, and don't move into an upper room if a lower room is empty
          allowedToMoveHere(from, to, rooms, part) &&
          // Don't move out of the correct room
          !inTheCorrectSpot(from, rooms, part) &&
          // Don't move if something is in the way
          $(route(from, to, part), slice(1, -1), map(pluckFrom(rooms)), every(is('.')))
      ),
      map(([p1, p2]) => ({
        cost: calculateCost(p1, p2, rooms[p1], part),
        rooms: $([...rooms], set(p2, rooms[p1]), set(p1, '.'))
      }))
    )

const done =
  (part: Part) =>
  ({ rooms }: State) =>
    $(
      homes[part],
      every((what, where) => rooms[where] == what)
    )

const heuristic =
  (part: Part) =>
  ({ rooms }: State) =>
    $(
      rooms,
      map((a, i) => calculateCost(i, bottomHome[part][a], a, part)),
      sum
    )

const findLowestCost = (part: Part, initialRooms: string) =>
  aStar({
    start: {
      cost: 0,
      rooms: $(initialRooms, split())
    },
    isEnd: done(part),
    neighbors: whereGo(part),
    cost: (_, { cost }) => cost,
    heuristic: heuristic(part),
    hash: ({ rooms }) => $(rooms, join(','))
  }).cost

console.log('Part 1:', findLowestCost(1, 'BDACADCB...........'))

console.log('Part 2:', findLowestCost(2, 'BDDDABCCAABDCCAB...........'))
