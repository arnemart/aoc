import {
  $,
  count,
  forEach,
  int,
  ints,
  join,
  length,
  map,
  parse,
  pipe,
  pluckFrom,
  readInput,
  sortNumeric,
  split,
  unique,
  values
} from '../../common'

type Program = { id: number; conn: number[] }

const programs: Program[] = $(
  readInput(),
  parse(/(\d+) <-> (.+)/, ([_, id, conn]) => ({ id: int(id), conn: $(conn, split(', '), ints) }))
)

const connections = ({ id, conn }: Program, found: Set<number> = new Set()) => {
  found.add(id)
  $(
    conn,
    forEach(c => {
      if (!found.has(c)) {
        found = connections($(c, pluckFrom(programs)), found)
      }
    })
  )
  return found
}

console.log('Part 1:', $(programs, count(pipe(connections, c => c.has(0)))))

console.log('Part 2:', $(programs, map(pipe(connections, values, sortNumeric(), join(','))), unique, length))
