import { $, add, fillArray, ife, is, max, mod, pluck, repeat, set } from '../../common'

const playerCount = 419
const part1steps = 71052
const part2steps = part1steps * 99

type Node = {
  val: number
  next: Node
  prev: Node
}

const start: Node = {
  val: 0,
  next: null,
  prev: null
}
start.next = start
start.prev = start

const insertAfter =
  (node: Node) =>
  (val: number): Node => {
    const newNode = { val, prev: node, next: node.next }
    newNode.prev.next = newNode
    newNode.next.prev = newNode
    return node
  }

const remove = (node: Node): Node => {
  node.prev.next = node.next
  node.next.prev = node.prev
  return node
}

type State = { current: Node; players: number[]; player: number }

const initialState: State = {
  current: start,
  players: fillArray(playerCount, 0),
  player: 0
}

const step = ({ current, players, player }: State, marble: number): State => ({
  players,
  ...$(
    marble + 1,
    mod(23),
    is(0),
    ife(
      () =>
        $(current.prev.prev.prev.prev.prev.prev, remove, current =>
          $(players, set(player, add(marble + 1 + current.val)), players => ({
            current: current.prev,
            players
          }))
        ),
      () => ({ current: $(marble + 1, insertAfter(current.next.next)) })
    )
  ),
  player: (player + 1) % players.length
})

const part1state = $(initialState, repeat(part1steps, step))

console.log('Part 1:', $(part1state, pluck('players'), max))
console.log('Part 2:', $(part1state, repeat(part2steps, step), pluck('players'), max))
