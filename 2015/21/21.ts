import {
  $,
  find,
  flatmap,
  last,
  loopUntil,
  lte,
  map,
  not,
  pluck,
  reverse,
  sort,
  uniquePermutations
} from '../../common'

type Player = {
  hp: number
  damage: number
  armor: number
  gold: number
}

const boss: Player = {
  hp: 109,
  damage: 8,
  armor: 2,
  gold: 0
}

const weapons = [
  [8, 4],
  [10, 5],
  [25, 6],
  [40, 7],
  [74, 8]
]
const armors = [
  [0, 0],
  [13, 1],
  [31, 2],
  [53, 3],
  [75, 4],
  [102, 5]
]
const rings = [
  [0, 0, 0],
  [0, 0, 0],
  [25, 1, 0],
  [50, 2, 0],
  [100, 3, 0],
  [20, 0, 1],
  [40, 0, 2],
  [80, 0, 3]
]

const players = $(
  weapons,
  flatmap(weapon =>
    $(
      armors,
      flatmap(armor =>
        $(
          rings,
          uniquePermutations(2),
          map(
            ([ring1, ring2]) =>
              ({
                hp: 100,
                damage: weapon[1] + ring1[1] + ring2[1],
                armor: armor[1] + ring1[2] + ring2[2],
                gold: weapon[0] + armor[0] + ring1[0] + ring2[0]
              } as Player)
          )
        )
      )
    )
  ),
  sort((p1, p2) => p1.gold - p2.gold)
)

const beatsBoss = (player: Player) =>
  $(
    loopUntil(
      (_, [playerHp, bossHp]) => [playerHp - (boss.damage - player.armor), bossHp - (player.damage - boss.armor)],
      ([playerHp, bossHp]) => $(playerHp, lte(0)) || $(bossHp, lte(0)),
      [player.hp, boss.hp]
    ),
    last,
    lte(0)
  )

console.log('Part 1:', $(players, find(beatsBoss), pluck('gold')))

console.log('Part 2:', $(players, reverse, find(not(beatsBoss)), pluck('gold')))
