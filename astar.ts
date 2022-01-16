import Heap = require('heap')

type Node<T> = {
  data: T
  g: number
  h: number
  f: number
  parent: Node<T>
}

type Params<T> = {
  start: T
  isEnd: (node: T) => boolean
  neighbors: (node: T) => T[]
  cost?: (a: T, b: T) => number
  heuristic?: (node: T) => number
  hash?: (node: T) => string
}

type Result<T> = {
  cost: number
  path: T[]
}

export default function aStar<T>(params: Params<T>): Result<T> {
  const hash = params.hash || defaultHash
  const cost = params.cost || defaultCost
  const heuristic = params.heuristic || defaultHeuristic

  const startNode: Node<T> = {
    data: params.start,
    g: 0,
    h: heuristic(params.start),
    f: 0,
    parent: null
  }
  startNode.f = startNode.h

  let bestNode = startNode

  const closedDataSet = new Set<string>()
  const openHeap = new Heap<Node<T>>(heapComparator)
  const openDataMap = new Map<string, Partial<Node<T>>>()

  openHeap.push(startNode)
  openDataMap.set(hash(startNode.data), startNode)

  while (openHeap.size()) {
    const node = openHeap.pop()
    const nodeHash = hash(node.data)
    openDataMap.delete(nodeHash)

    if (params.isEnd(node.data)) {
      // done
      return {
        cost: node.g,
        path: reconstructPath(node)
      }
    }

    // not done yet
    closedDataSet.add(nodeHash)

    for (const neighborData of params.neighbors(node.data)) {
      const neighborHash = hash(neighborData)
      if (closedDataSet.has(neighborHash)) {
        // skip closed neighbors
        continue
      }
      const gFromThisNode = node.g + cost(node.data, neighborData)
      let neighborNode = openDataMap.get(neighborHash)
      let update = false

      if (!neighborNode) {
        neighborNode = {
          data: neighborData
          // other properties will be set later
        }
        // add neighbor to the open set
        openDataMap.set(neighborHash, neighborNode)
      } else {
        if (neighborNode.g < gFromThisNode) {
          // skip this one because another route is faster
          continue
        }
        update = true
      }

      // found a new or better route.
      // update this neighbor with this node as its new parent
      neighborNode.parent = node
      neighborNode.g = gFromThisNode
      neighborNode.h = heuristic(neighborData)
      neighborNode.f = gFromThisNode + neighborNode.h

      if (neighborNode.h < bestNode.h) {
        bestNode = neighborNode as Node<T>
      }

      if (update) {
        openHeap.heapify()
      } else {
        openHeap.push(neighborNode as Node<T>)
      }
    }
  }
  // all the neighbors of every accessible node have been exhausted
  throw new Error('No path found')
}

const reconstructPath = <T>(node: Node<T>): T[] =>
  node.parent ? reconstructPath(node.parent).concat(node.data) : [node.data]

const defaultHash = <T>(node: T) => JSON.stringify(node)
const defaultCost = () => 1
const defaultHeuristic = () => 1

const heapComparator = <T>(a: Node<T>, b: Node<T>) => a.f - b.f
