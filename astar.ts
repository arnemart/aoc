// Typescriptified version of https://github.com/superjoe30/node-astar

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
  const hash = params.hash || JSON.stringify
  const cost = params.cost || (() => 1)
  const heuristic = params.heuristic || (() => 1)

  const startNode: Node<T> = {
    data: params.start,
    g: 0,
    h: heuristic(params.start),
    f: 0,
    parent: null
  }
  startNode.f = startNode.h

  const closedDataSet = new Set<string>()
  const openHeap = new Heap<Node<T>>((a, b) => a.f - b.f)
  const openDataMap = new Map<string, Partial<Node<T>>>()

  openHeap.push(startNode)
  openDataMap.set(hash(startNode.data), startNode)
  while (!openHeap.empty()) {
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

      if (update) {
        openHeap.heapify()
      } else {
        openHeap.push(neighborNode as Node<T>)
      }
    }
  }
  // all the neighbors of every accessible node have been exhausted
  return null
}

const reconstructPath = <T>(node: Node<T>): T[] =>
  node.parent ? [...reconstructPath(node.parent), node.data] : [node.data]
