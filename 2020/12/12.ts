import { $, cond, lines, map, match, next, readInput, reduce } from '../../common'

type Direction = 'N' | 'E' | 'S' | 'W'
type Action = Direction | 'R' | 'L' | 'F'
type Command = { action: Action; value: number }
type Ship = { heading: Direction; x: number; y: number }
type Waypoint = { x: number; y: number }
const dirs = ['N', 'E', 'S', 'W'] as Direction[]

const input = $(
  readInput(),
  lines,
  map(match(/^(\w)(\d+)$/)),
  map(m => ({ action: m[1], value: parseInt(m[2], 10) } as Command))
)

const move =
  <T extends Waypoint>(state: T, dir: Direction, thisFar: number) =>
  (): T =>
    $(
      dir,
      cond([
        ['N', { ...state, y: state.y - thisFar }],
        ['E', { ...state, x: state.x + thisFar }],
        ['S', { ...state, y: state.y + thisFar }],
        ['W', { ...state, x: state.x - thisFar }]
      ])
    )

const turnShip = (state: Ship, times: number) => (): Ship => ({
  ...state,
  heading: $(dirs, next(dirs.indexOf(state.heading), times))
})

const travel1 = (state: Ship, command: Command): Ship =>
  $(
    command.action,
    cond([
      [dirs, move(state, command.action as Direction, command.value)],
      ['F', move(state, state.heading, command.value)],
      ['R', turnShip(state, command.value / 90)],
      ['L', turnShip(state, -command.value / 90)]
    ])
  )

const move1 = (state: Ship, commands: Command[]): Ship =>
  $(
    commands,
    reduce((state, command) => travel1(state, command), state)
  )

const initialShipState = { heading: 'E', x: 0, y: 0 } as Ship
const finalState1 = move1(initialShipState, input)

console.log('Part 1:', Math.abs(finalState1.x) + Math.abs(finalState1.y))

const turnWaypoint = (wp: Waypoint, times: number) => (): Waypoint =>
  times == 0
    ? wp
    : turnWaypoint(
        {
          x: -wp.y,
          y: wp.x
        },
        times - 1
      )()

const moveShip = (ship: Ship, waypoint: Waypoint, times: number) => (): Ship =>
  times == 0
    ? ship
    : moveShip(
        {
          ...ship,
          x: ship.x + waypoint.x,
          y: ship.y + waypoint.y
        },
        waypoint,
        times - 1
      )()

type State = { ship: Ship; waypoint: Waypoint }
const ret = (s: Ship | (() => Ship), wp: Waypoint | (() => Waypoint)) => (): State => ({
  ship: s instanceof Function ? s() : s,
  waypoint: wp instanceof Function ? wp() : wp
})

const step2 = (ship: Ship, waypoint: Waypoint, command: Command): State =>
  $(
    command.action,
    cond([
      [dirs, ret(ship, move(waypoint, command.action as Direction, command.value))],
      ['R', ret(ship, turnWaypoint(waypoint, command.value / 90))],
      ['L', ret(ship, turnWaypoint(waypoint, dirs.length - command.value / 90))],
      ['F', ret(moveShip(ship, waypoint, command.value), waypoint)]
    ])
  )

const travel2 = (ship: Ship, waypoint: Waypoint, commands: Command[]): State =>
  $(
    commands,
    reduce((state, command) => step2(state.ship, state.waypoint, command), { ship, waypoint } as State)
  )

const initialWaypoint = { x: 10, y: -1 } as Waypoint
const finalState2 = travel2(initialShipState, initialWaypoint, input).ship

console.log('Part 2:', Math.abs(finalState2.x) + Math.abs(finalState2.y))
