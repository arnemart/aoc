import { $, inclusiveRange, reduce } from '../../common'

const input = 369

type Node = { v: number; next: Node }

const start: Node = { v: 0, next: null }
start.next = start

const append = (node: Node, v: number): Node => {
  const newNode = { v, next: node.next }
  node.next = newNode
  return newNode
}

const next = (node: Node, v: number): Node => (v == 0 ? node : next(node.next, v - 1))

const find = (node: Node, v: number): Node => {
  while (node.v != v) {
    node = node.next
  }
  return node
}

const step = (node: Node, n: number) => append(next(node, input), n)

const buf = $(inclusiveRange(1, 2017), reduce(step, start))

console.log('Part 1:', find(buf, 2017).next.v)

// Go grab a snack, this takes a few minutes
const buf2 = $(inclusiveRange(2018, 50000000), reduce(step, buf))

console.log('Part 1:', find(buf2, 0).next.v)
