import {
  $,
  add,
  cond,
  count,
  id,
  is,
  join,
  map,
  pipe,
  pluck,
  push,
  readInput,
  repeat,
  slice,
  split,
  tee,
  unshift,
  zip
} from '../../common'

const room = $(readInput(), split())

const nextRoom = ({ room, safe }: { room: string[]; safe: number }) =>
  $(
    room,
    tee(pipe(slice(0, -1), unshift('.')), id, pipe(slice(1), push('.'))),
    zip,
    map(pipe(join(), cond([[['^^.', '.^^', '^..', '..^'], '^']], '.'))),
    tiles => ({
      room: tiles,
      safe: $(tiles, count(is('.')), add($(safe, cond([[0, () => $(room, count(is('.')))]], safe))))
    })
  )

console.log('Part 1:', $({ room, safe: 0 }, repeat(39, nextRoom), pluck('safe')))

console.log('Part 1:', $({ room, safe: 0 }, repeat(399999, nextRoom), pluck('safe')))
