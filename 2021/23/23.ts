import {
  $,
  and,
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
  range,
  set,
  slice,
  split,
  sum
} from '../../common'

import aStar = require('a-star')

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

const buildHomes = (count: number) => [
  ...fillArray(count, 'A'),
  ...fillArray(count, 'B'),
  ...fillArray(count, 'C'),
  ...fillArray(count, 'D')
]
const homes = { 1: buildHomes(2), 2: buildHomes(4) }

const siderooms = {
  1: range(8),
  2: range(16)
}
const crossroads = {
  1: [10, 12, 14, 16],
  2: [18, 20, 22, 24]
}
const hallways = {
  1: [8, 9, 11, 13, 15, 17, 18],
  2: [16, 17, 19, 21, 23, 25, 26]
}

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

const inTheCorrectSpot = (p: number, rooms: string[], part: Part) =>
  $(
    p,
    cond(
      [
        [
          siderooms[part],
          $(
            inclusiveRange(bottom(p, part), p),
            map(p => rooms[p]),
            every(is(homes[part][p]))
          )
        ]
      ],
      false
    )
  )

const allowedToMoveHere = (from: number, to: number, rooms: string[], part: Part) =>
  $(
    to,
    cond(
      [
        [
          siderooms[part],
          rooms[from] == homes[part][to] &&
            $(
              inclusiveRange(to, bottom(to, part)),
              slice(1),
              map(p => rooms[p]),
              every(is(homes[part][to]))
            )
        ]
      ],
      true
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
        and(
          // Move an amphipod to an empty space
          ([p1, p2]) => rooms[p1] != '.' && rooms[p2] == '.',
          // Only move into the correct rooms, and don't move
          // into an upper room if the lower is empty
          ([p1, p2]) => allowedToMoveHere(p1, p2, rooms, part),
          // Don't move out of the correct room
          ([p1]) => !inTheCorrectSpot(p1, rooms, part),
          // Don't move if something is in the way
          ([p1, p2]) =>
            $(
              route(p1, p2, part),
              slice(1, -1),
              every(pos => rooms[pos] == '.')
            )
        )
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
      map((a, i) => calculateCost(i, 0, a, part)),
      sum
    )

const findLowestCost = (part: Part, initialRooms: string) =>
  aStar({
    start: {
      cost: 0,
      rooms: $(initialRooms, split())
    },
    isEnd: done(part),
    neighbor: whereGo(part),
    distance: (_, { cost }) => cost,
    heuristic: heuristic(part),
    hash: ({ rooms }) => $(rooms, join(','))
  }).cost

console.log('Part 1:', findLowestCost(1, 'BDACADCB...........'))

console.log('Part 2:', findLowestCost(2, 'BDDDABCCAABDCCAB...........'))
