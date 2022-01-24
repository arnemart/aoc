import aStar from '../../astar'
import {
  $,
  abs,
  and,
  arrEqual,
  clone,
  cond,
  count,
  filter,
  first,
  flatmap,
  is,
  join,
  length,
  lines,
  loopUntil,
  map,
  nonNull,
  nth,
  pipe,
  pluck,
  product,
  readInput,
  reduce,
  some,
  sortBy,
  split,
  spyWith,
  sum,
  uniqueBy,
  zipWith
} from '../../common'

type Unit = { id: number; type: 'E' | 'G'; x: number; y: number; hp: number }
type Grid = (string | Unit)[][]
const enemy = { E: 'G', G: 'E' }

const { grid, units } = $(
  readInput(),
  lines,
  reduce(
    ({ grid, units }, line, y) =>
      $(
        line,
        split(),
        reduce(
          ({ row, units }, v, x) =>
            $(
              v,
              cond(
                [
                  [
                    ['G', 'E'],
                    () => ({
                      row: [...row, '.'],
                      units: [...units, { id: units.length, type: v, x, y, hp: 200 } as Unit]
                    })
                  ]
                ],
                () => ({ row: [...row, v], units })
              )
            ),
          { row: [], units }
        ),
        ({ row, units }) => ({
          grid: [...grid, row],
          units
        })
      ),
    { grid: [] as Grid, units: [] as Unit[] }
  )
)

const print = (units: Unit[]) =>
  $(
    units,
    gridWithUnitsOnIt,
    map((row, i) =>
      $(
        row,
        map(v => (v instanceof Object ? v.type : v)),
        join(),
        l =>
          l +
          '  ' +
          $(
            units,
            filter(pipe(pluck('y'), is(i))),
            sortBy(pluck('x')),
            map(({ type, hp }) => `${type}(${hp})`),
            join(', ')
          )
      )
    ),
    join('\n'),
    spyWith(s => s + '\n'),
    () => units
  )

const alive = (unit: Unit) => unit.hp > 0

const gridWithUnitsOnIt = (units: Unit[]): Grid =>
  $(
    units,
    filter(alive),
    reduce((grid, unit) => {
      grid[unit.y][unit.x] = unit
      return grid
    }, clone(grid))
  )

const neighborDeltas = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0]
]

const neighborLocations = ([y, x]: number[]) => $(neighborDeltas, map(pipe(zipWith([y, x]), map(sum))))
const emptyNeighborLocations = (grid: Grid) =>
  pipe(
    neighborLocations,
    filter(([y, x]) => grid[y][x] == '.')
  )

const isEnemy =
  (grid: Grid, unit) =>
  ([y, x]: number[]) =>
    grid[y][x] instanceof Object && (grid[y][x] as Unit).type == enemy[unit.type]

const inReadingOrder = (units: Unit[]) =>
  $(
    units,
    sortBy(({ y, x }) => y * 1000 + x)
  )

const sortValue = ([y, x]: number[], v = 1) => 1000000 * v + 1000 * y + x

const bestPath = (start: Unit, grid: Grid) => (end: number[]) =>
  aStar({
    start: [start.y, start.x],
    isEnd: arrEqual(end),
    neighbors: emptyNeighborLocations(grid),
    cost: (_, p) => sortValue(p),
    heuristic: ([y, x]) => sortValue([-y, -x], abs(end[0] - y) + abs(end[1] - x)),
    hash: join(',')
  })

const moveAndFight = (units: Unit[], unit: Unit, elfAttackPower: number) => {
  if (unit.hp <= 0) {
    return units
  }

  const grid = gridWithUnitsOnIt(units)

  if (!$(unit, pluck(['y', 'x']), neighborLocations, some(isEnemy(grid, unit)))) {
    const pathsToEnemies = $(
      units,
      filter(and(alive, pipe(pluck('type'), is(enemy[unit.type])))),
      flatmap(({ y, x }: Unit) => $([y, x], emptyNeighborLocations(grid))),
      map(bestPath(unit, grid)),
      filter(nonNull),
      sortBy(pluck('cost'))
    )
    if (pathsToEnemies.length > 0) {
      const moveTo = $(pathsToEnemies, first, pluck('path'), nth(1))
      unit.y = moveTo[0]
      unit.x = moveTo[1]
    }
  }

  const enemiesCloseBy = $(
    unit,
    pluck(['y', 'x']),
    neighborLocations,
    filter(isEnemy(grid, unit)),
    map(([y, x]) => grid[y][x] as Unit),
    filter(alive)
  )

  if (enemiesCloseBy.length > 0) {
    const enemyToAttack = $(
      enemiesCloseBy,
      sortBy(unit => sortValue([unit.y, unit.x], unit.hp)),
      first
    )
    units[enemyToAttack.id].hp -= unit.type == 'E' ? elfAttackPower : 3
  }

  return units
}

const battleIsOver = (units: Unit[]) => $(units, uniqueBy(pluck('type')), length, is(1))

const step = (elfAttackPower: number) => (units: Unit[]) =>
  $(
    units,
    reduce(
      ({ units, endedPrematurely }, _, unitId) => {
        if (endedPrematurely || units[unitId].hp <= 0) return { units, endedPrematurely }
        const nextUnits = moveAndFight(units, units[unitId], elfAttackPower)
        return {
          units: nextUnits,
          endedPrematurely: unitId < units.length - 1 && $(nextUnits, filter(alive), battleIsOver)
        }
      },
      { units, endedPrematurely: false }
    ),
    ({ units, endedPrematurely }) => ({
      units: $(
        units,
        filter(alive),
        inReadingOrder,
        map((unit, id) => ({ ...unit, id }))
      ),
      endedPrematurely
    })
  )

const play = (units: Unit[], elfAttackPower = 3): { units: Unit[]; rounds: number } =>
  loopUntil(
    (_, { units, rounds }) =>
      $(units, step(elfAttackPower), ({ units, endedPrematurely }) => ({
        units,
        rounds: rounds + (endedPrematurely ? 0 : 1)
      })),
    pipe(pluck('units'), battleIsOver),
    { units: clone(units), rounds: 0 }
  )

const finalState = play(units)

// 79, 2621 = 207059
console.log('Part 1:', $([finalState.rounds, $(finalState.units, map(pluck('hp')), sum)], product))

const startingElfCount = $(units, count(pipe(pluck('type'), is('E'))))

const finalFinalState = loopUntil(
  i => play(units, i + 4),
  ({ units }) => $(units, count(pipe(pluck('type'), is('E'))), is(startingElfCount))
)

console.log('Part 2:', $([finalFinalState.rounds, $(finalFinalState.units, map(pluck('hp')), sum)], product))
