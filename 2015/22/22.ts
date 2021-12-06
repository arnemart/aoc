import { $, cond, filter, flatmap, gte, is, loopUntil, lte, map, min, not, pipe, pluck, some, sum } from '../../common'

type Spell = {
  name: string
  cost: number
  damage: number
  heal: number
  duration: number
  shield: number
  damagePerTurn: number
  manaPerTurn: number
}

const defaultSpell: Spell = {
  name: '',
  damage: 0,
  heal: 0,
  cost: 0,
  duration: 0,
  shield: 0,
  damagePerTurn: 0,
  manaPerTurn: 0
}

const spells: Spell[] = [
  { ...defaultSpell, name: 'missile', cost: 53, damage: 4 },
  { ...defaultSpell, name: 'drain', cost: 73, damage: 2, heal: 2 },
  { ...defaultSpell, name: 'shield', cost: 113, duration: 6, shield: 7 },
  { ...defaultSpell, name: 'poison', cost: 173, duration: 6, damagePerTurn: 3 },
  { ...defaultSpell, name: 'recharge', cost: 229, duration: 5, manaPerTurn: 101 }
]

type GameState = {
  status: 'playersTurn' | 'bossesTurn' | 'won'
  hp: number
  mana: number
  manaSpent: number
  bossHp: number
  bossDamage: number
  effects: Spell[]
}

type Mode = 'easy' | 'hard'

const effect = (name: keyof Spell) => (state: GameState) => $(state.effects, map(pluck(name)), sum)

const performEffects =
  (mode: Mode) =>
  (state: GameState): GameState => {
    if (state.status == 'won') {
      return state
    } else {
      const bossHp = state.bossHp - $(state, effect('damagePerTurn'))
      return {
        ...state,
        mana: state.mana + $(state, effect('manaPerTurn')),
        bossHp: bossHp,
        hp: state.hp - (mode == 'easy' ? 0 : 1),
        status: $(bossHp, lte(0)) ? 'won' : state.status,
        effects: $(
          state.effects,
          filter(pipe(pluck('duration'), gte(2))),
          map(spell => ({
            ...spell,
            duration: spell.duration - 1
          }))
        )
      }
    }
  }

const performSpell =
  (state: GameState) =>
  (spell: Spell): GameState => {
    const bossHp = state.bossHp - spell.damage
    return {
      ...state,
      hp: state.hp + spell.heal,
      bossHp: bossHp,
      status: $(bossHp, lte(0)) ? 'won' : 'bossesTurn',
      mana: state.mana - spell.cost,
      manaSpent: state.manaSpent + spell.cost,
      effects: [...state.effects, ...$(spell.duration ? [{ ...spell }] : [])]
    }
  }

const availableSpells = (state: GameState) =>
  $(
    spells,
    filter(spell => state.mana >= spell.cost && $(state.effects, not(some(pipe(pluck('name'), is(spell.name))))))
  )

const playRound =
  (mode: Mode) =>
  (state: GameState): GameState[] =>
    $({ ...state }, performEffects(mode), state =>
      $(
        state.status,
        cond([
          ['won', [state]],
          ['playersTurn', () => $(state, availableSpells, map(performSpell({ ...state })))],
          [
            'bossesTurn',
            [
              {
                ...state,
                hp: state.hp - (state.bossDamage - $(state, effect('shield'))),
                status: 'playersTurn'
              } as GameState
            ]
          ]
        ]),
        filter(pipe(pluck('hp'), gte(1)))
      )
    )

const initialState: GameState = {
  status: 'playersTurn',
  hp: 50,
  mana: 500,
  bossHp: 58,
  bossDamage: 9,
  manaSpent: 0,
  effects: []
}

const play = (mode: 'easy' | 'hard') =>
  $(
    loopUntil(
      (_, states) => $(states, flatmap(playRound(mode))),
      states => states.length == 0 || $(states, some(pipe(pluck('bossHp'), lte(0)))),
      [initialState]
    ),
    filter(pipe(pluck('status'), is('won'))),
    map(pluck('manaSpent')),
    min
  )

console.log('Part 1:', play('easy'))

console.log('Part 2:', play('hard'))
