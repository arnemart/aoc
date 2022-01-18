import {
  $,
  add,
  filter,
  ints,
  map,
  nonNull,
  pipe,
  pluckFrom,
  push,
  range,
  readInput,
  reduce,
  slice,
  split,
  subtract,
  sum
} from '../../common'

const input = $(readInput(), split(' '), ints)

type Node = {
  children: Node[]
  metadata: number[]
}

const parseTree = ([childCount, metadataCount, ...rest]: number[]): { node: Node; data: number[] } =>
  $(
    range(childCount),
    reduce(
      ({ children, data }) => $(parseTree(data), ({ node, data }) => ({ children: $(children, push(node)), data })),
      { children: [], data: rest }
    ),
    ({ children, data }) => ({
      node: {
        children,
        metadata: $(data, slice(0, metadataCount))
      },
      data: $(data, slice(metadataCount))
    })
  )

const sumMetadata = ({ children, metadata }: Node) => $(metadata, sum, add($(children, map(sumMetadata), sum)))

const tree = parseTree(input).node

console.log('Part 1:', $(tree, sumMetadata))

const value = ({ children, metadata }: Node) =>
  children.length == 0
    ? $(metadata, sum)
    : $(metadata, map(pipe(subtract(1), pluckFrom(children))), filter(nonNull), map(value), sum)

console.log('Part 2:', $(tree, value))
