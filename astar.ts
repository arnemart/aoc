import Heap = require('heap')

export default aStar

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
  status: 'success' | 'noPath'
  cost: number
  path: T[]
}

function aStar<T>(params: Params<T>): Result<T> {
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

  let bestNode = startNode
  startNode.f = startNode.h
  // leave .parent undefined
  const closedDataSet = new Set<string>()
  const openHeap = new Heap<Node<T>>(heapComparator)
  const openDataMap = new Map<string, Partial<Node<T>>>()
  openHeap.push(startNode)
  openDataMap.set(hash(startNode.data), startNode)

  while (openHeap.size()) {
    const node = openHeap.pop()
    openDataMap.delete(hash(node.data))
    if (params.isEnd(node.data)) {
      // done
      return {
        status: 'success',
        cost: node.g,
        path: reconstructPath(node)
      }
    }
    // not done yet
    closedDataSet.add(hash(node.data))
    const neighbors = params.neighbors(node.data)
    for (const neighborData of neighbors) {
      if (closedDataSet.has(hash(neighborData))) {
        // skip closed neighbors
        continue
      }
      const gFromThisNode = node.g + cost(node.data, neighborData)
      let neighborNode = openDataMap.get(hash(neighborData))
      let update = false
      if (neighborNode === undefined) {
        // add neighbor to the open set
        neighborNode = {
          data: neighborData
        }
        // other properties will be set later
        openDataMap.set(hash(neighborData), neighborNode)
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
      if (neighborNode.h < bestNode.h) bestNode = neighborNode as Node<T>
      if (update) {
        openHeap.heapify()
      } else {
        openHeap.push(neighborNode as Node<T>)
      }
    }
  }
  // all the neighbors of every accessible node have been exhausted
  return {
    status: 'noPath',
    cost: bestNode.g,
    path: reconstructPath(bestNode)
  }
}

const reconstructPath = <T>(node: Node<T>): T[] =>
  node.parent ? reconstructPath(node.parent).concat(node.data) : [node.data]

const defaultHash = <T>(node: T) => JSON.stringify(node)
const defaultCost = () => 1
const defaultHeuristic = () => 1

const heapComparator = <T>(a: Node<T>, b: Node<T>) => a.f - b.f
