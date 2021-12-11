import {
  $,
  arrSameValues,
  filter,
  find,
  first,
  int,
  lines,
  map,
  match,
  pipe,
  pluck,
  product,
  push,
  readInput,
  reduce,
  set,
  slice,
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
type Robots = Robot[]

const giveToRobot =
  (num: number, val: number) =>
  (bots: Robots): Robots =>
    $(bots, set(num, set('has', push(val))))

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
    reduce((bots, bot) => $(bots, set(bot.num, bot)), []),
    bots =>
      $(
        l,
        filter(test(valueReg)),
        map(match(valueReg)),
        reduce((bots, matches) => $(bots, giveToRobot(int(matches[2]), int(matches[1]))), bots)
      )
  )
)

type Bins = number[][]

const addToBin =
  (bin: number, val: number) =>
  (bins: Bins): Bins =>
    $(
      bins,
      set(bin, b => $(b ?? [], push(val)))
    )

const botsDoStuff = (bots: Robots, bins: Bins = [], foundBot: number = 0): { bot: number; bins: Bins } =>
  $(
    bots,
    filter(bot => bot.has.length == 2),
    reduce(
      ({ bots, bins }, bot) => {
        const [l, h] = $(bot.has, sortNumeric())
        bot.has = []
        if (bot.lowType == 'bot') {
          bots = $(bots, giveToRobot(bot.low, l))
        } else {
          bins = $(bins, addToBin(bot.low, l))
        }
        if (bot.highType == 'bot') {
          bots = $(bots, giveToRobot(bot.high, h))
        } else {
          bins = $(bins, addToBin(bot.high, h))
        }
        return { bots, bins }
      },
      { bots, bins }
    ),
    ({ bots, bins }) =>
      foundBot && bins[0] && bins[1] && bins[2]
        ? { bot: foundBot, bins }
        : botsDoStuff(bots, bins, foundBot || $(bots, find(pipe(pluck('has'), arrSameValues([61, 17]))))?.num)
  )

const result = botsDoStuff(robots)

console.log('Part 1:', $(result, pluck('bot')))

console.log('Part 2:', $(result, pluck('bins'), slice(0, 3), map(first), product))
