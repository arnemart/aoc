import {
  $,
  add,
  chop,
  cond,
  first,
  is,
  join,
  leftPad,
  length,
  loopUntil,
  map,
  max,
  min,
  mult,
  number,
  pipe,
  pluck,
  product,
  push,
  readInput,
  slice,
  split,
  substr,
  sum,
  takeUntil,
  tee,
  test,
  toString
} from '../../common'

const input = $(readInput(), split(), map(pipe(number(16), toString(2), leftPad(4, '0'))), join())

type Packet = {
  version: number
  type: number
  value: number
  subpackets: Packet[]
  size: number
}

const readPacket = (bin: string): [Packet, string] => {
  const basePacket: Partial<Packet> = {
    version: $(bin, substr(0, 3), number(2)),
    type: $(bin, substr(3, 6), number(2))
  }
  if (basePacket.type == 4) {
    const [value, size] = $(
      bin,
      substr(6),
      split(),
      chop(5),
      takeUntil(([l]) => $(l, is('0'))),
      map(pipe(slice(1), join())),
      tee(pipe(join(), number(2)), pipe(length, mult(5), add(6)))
    )
    return [{ ...basePacket, value, size, subpackets: [] } as Packet, $(bin, substr(size))]
  } else {
    const lengthType = $(bin, substr(6, 7))
    if (lengthType == '0') {
      const subSize = $(bin, substr(7, 22), number(2))
      const subpackets = readSubPackets($(bin, substr(22, 22 + subSize)))
      const size = 22 + subSize
      return [{ ...basePacket, value: 0, size, subpackets } as Packet, $(bin, substr(size))]
    } else {
      const packetCount = $(bin, substr(7, 18), number(2))
      const subpackets = readSubPackets($(bin, substr(18)), packetCount)
      const size = $(subpackets, map(pluck('size')), sum, add(18))
      return [{ ...basePacket, value: 0, size, subpackets } as Packet, $(bin, substr(size))]
    }
  }
}

const readSubPackets = (bin: string, count = Infinity): Packet[] =>
  $(
    loopUntil(
      (_, { packets, bin }) => {
        const [p, s] = readPacket(bin)
        return { packets: $(packets, push(p)), bin: s }
      },
      ({ bin, packets }) => packets.length == count || $(bin, test(/^0*$/)),
      { packets: [], bin }
    ),
    pluck('packets')
  )

const sumVersionNumbers = (p: Packet): number => $(p.subpackets, map(sumVersionNumbers), sum, add(p.version))

const packets = $(input, readPacket, first)

console.log('Part 1:', $(packets, sumVersionNumbers))

const value = (p: Packet) =>
  $(
    p.type,
    cond([
      [4, p.value],
      [0, () => $(p.subpackets, map(value), sum)],
      [1, () => $(p.subpackets, map(value), product)],
      [2, () => $(p.subpackets, map(value), min)],
      [3, () => $(p.subpackets, map(value), max)],
      [5, () => $(p.subpackets, map(value), ([a, b]) => (a > b ? 1 : 0))],
      [6, () => $(p.subpackets, map(value), ([a, b]) => (a < b ? 1 : 0))],
      [7, () => $(p.subpackets, map(value), ([a, b]) => (a == b ? 1 : 0))]
    ])
  )

console.log('Part 1:', $(packets, value))