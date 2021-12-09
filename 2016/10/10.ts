import {
  $,
  arrEqual,
  filter,
  find,
  first,
  int,
  ints,
  keys,
  lines,
  map,
  match,
  pipe,
  pluck,
  product,
  readInput,
  reduce,
  set,
  sortNumeric,
  test
} from '../../common'

const valueReg = /^value (\d+) goes to bot (\d+)$/
const botReg = /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/

type Robot = {
  num: number
  high: number
  highType: string
  low: number
  lowType: string
  has: number[]
}
type Robots = Record<number, Robot>

const giveToRobot =
  (num: number, val: number) =>
  (bots: Robots): Robots =>
    $(bots, set(num, { ...bots[num], has: [...bots[num].has, val] }))

const robots = $(readInput(), lines, l =>
  $(
    l,
    filter(test(botReg)),
    map(
      pipe(
        match(botReg),
        ([_, n, lt, l, ht, h]) =>
          ({
            num: int(n),
            highType: ht,
            high: int(h),
            lowType: lt,
            low: int(l),
            has: []
          } as Robot)
      )
    ),
    reduce((bots, bot) => $(bots, set(bot.num, bot)), {} as Robots),
    bots =>
      $(
        l,
        filter(test(valueReg)),
        map(match(valueReg)),
        reduce((bots, matches) => $(bots, giveToRobot(int(matches[2]), int(matches[1]))), bots)
      )
  )
)

type Bins = Record<number, number[]>

const addToBin =
  (bin: number, val: number) =>
  (bins: Bins): Bins =>
    $(
      bins,
      set(bin, (b: number[]) => (b ? [...b, val] : [val]))
    )

const findBotWith61and17 = (bots: Robots, bins: Bins = {}, foundBot: number = 0): { bot: number; bins: Bins } =>
  $(
    bots,
    keys,
    ints,
    filter(key => bots[key].has.length == 2),
    reduce(
      ({ bots, bins }, key) => {
        const bot: Robot = bots[key]
        const has = $(bot.has, sortNumeric())
        bot.has = []
        if (bot.lowType == 'bot') {
          bots = $(bots, giveToRobot(bot.low, has[0]))
        } else {
          bins = $(bins, addToBin(bot.low, has[0]))
        }
        if (bot.highType == 'bot') {
          bots = $(bots, giveToRobot(bot.high, has[1]))
        } else {
          bins = $(bins, addToBin(bot.high, has[1]))
        }
        return { bots, bins }
      },
      { bots, bins }
    ),
    ({ bots, bins }) => {
      if (foundBot) {
        if (bins[0] && bins[1] && bins[2]) {
          return { bot: foundBot, bins }
        } else {
          return findBotWith61and17(bots, bins, foundBot)
        }
      } else {
        const botWith61and17 = $(
          bots,
          keys,
          ints,
          find(key => $(bots[key].has, arrEqual([61, 17])))
        )

        if (botWith61and17) {
          return findBotWith61and17(bots, bins, botWith61and17)
        } else {
          return findBotWith61and17(bots, bins)
        }
      }
    }
  )

const result = findBotWith61and17(robots)

console.log('Part 1:', $(result, pluck('bot')))

console.log('Part 2:', $(result, pluck('bins'), pluck([0, 1, 2]), map(first), product))
