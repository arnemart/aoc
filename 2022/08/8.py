from itertools import product

forest = [[int(t) for t in list(line)] for line in open("input.txt").read().splitlines()]
h = len(forest)
w = len(forest[0])

def trees_in_all_directions(y, x):
  return [
    [forest[yy][x] for yy in range(y)][::-1],
    [forest[y][xx] for xx in range(x)][::-1],
    [forest[yy][x] for yy in range(y+1, h)],
    [forest[y][xx] for xx in range(x+1, w)],
  ]

def max_in_all_directions(y, x):
  return min([max(trees) for trees in trees_in_all_directions(y, x)])

def is_visible(y, x):
  return y == 0 or x == 0 or y == h-1 or x == w-1 or max_in_all_directions(y, x) < forest[y][x]

print("Part 1:", sum(1 for y, x in product(range(h), range(w)) if is_visible(y, x)))

def count_visible(trees, tree):
  higher = [i for i in range(len(trees)) if trees[i] >= tree]
  if len(higher) > 0:
    return len(trees[:higher[0] + 1])
  else:
    return len(trees)

def scenic_score(y, x):
  u, l, d, r = [count_visible(t, forest[y][x]) for t in trees_in_all_directions(y, x)]
  return u*l*d*r

print("Part 2:", max([scenic_score(y, x) for y, x in product(range(h), range(w))]))