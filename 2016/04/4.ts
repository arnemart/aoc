import {
  $,
  cond,
  entries,
  filter,
  find,
  first,
  frequencies,
  int,
  is,
  join,
  map,
  mapEntries,
  parse,
  pipe,
  pluck,
  readInput,
  replace,
  set,
  slice,
  sort,
  split,
  sum
} from '../../common'

type Room = {
  name: string
  sector: number
  checksum: string
}

const rooms = $(
  readInput(),
  parse(/^([a-z-]+)-(\d+)\[(\w+)\]$/, ([_, name, sector, checksum]) => ({
    name,
    checksum,
    sector: $(sector, int)
  }))
)

const checksum = (name: string) =>
  $(
    name,
    replace(/-/g, ''),
    split(),
    frequencies,
    mapEntries,
    sort((a, b) => (a[1] == b[1] ? a[0].localeCompare(b[0]) : b[1] - a[1])),
    map(first),
    slice(0, 5),
    join()
  )

console.log(
  'Part 1:',
  $(
    rooms,
    filter(room => $(room.name, checksum, is(room.checksum))),
    map(pluck('sector')),
    sum
  )
)

const shiftName = (room: Room): Room =>
  $(
    room,
    set('name', name =>
      $(
        name,
        split(),
        map(cond([['-', ' ']], c => String.fromCharCode(((c.charCodeAt(0) + room.sector - 97) % 26) + 97))),
        join()
      )
    )
  )

console.log(
  'Part 2:',
  $(rooms, map(shiftName), find(pipe(pluck('name'), is('northpole object storage'))), pluck('sector'))
)
