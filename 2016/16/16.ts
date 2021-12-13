import {
  $,
  allEqual,
  chop,
  cond,
  even,
  gte,
  id,
  join,
  length,
  loopUntil,
  map,
  pipe,
  reverse,
  split,
  substr,
  tee
} from '../../common'

const input = '11101000110010100'

const flip = (s: string): string => $(s, split(), reverse, map(cond([['1', '0']], '1')), join())

const modifiedDragonCurve = (s: string): string => $(s, tee(id, flip), join('0'))

const fillDisk = (len: number) => (input: string) =>
  $(
    loopUntil((_, data) => modifiedDragonCurve(data), pipe(length, gte(len)), input),
    substr(0, len)
  )

const checksum = (str: string) =>
  $(str, split(), chop(2), map(pipe(allEqual, cond([[true, '1']], '0'))), join(), s =>
    $(s, length, even, cond([[true, () => checksum(s)]], s))
  )

console.log('Part 1:', $(input, fillDisk(272), checksum))

console.log('Part 2:', $(input, fillDisk(35651584), checksum))
