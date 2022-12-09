moves = [[line.split()[0], int(line.split()[1])] for line in open("input.txt").read().splitlines()]

def move_head(hx, hy, dir):
  return {
    "U": (hx, hy-1),
    "D": (hx, hy+1),
    "L": (hx-1, hy),
    "R": (hx+1, hy)
  }[dir]

def move_tail(hx, hy, tx, ty):
  dx = hx - tx
  dy = hy - ty
  nx = dx//2 if abs(dx) == 2 else dx if abs(dy) == 2 else 0
  ny = dy//2 if abs(dy) == 2 else dy if abs(dx) == 2 else 0
  return (tx+nx, ty+ny)

def move(rope, dir, dist):
  head = rope[0]
  tails = rope[1:]
  for _ in range(dist):
    head.append(move_head(*head[-1], dir))
    prev = head[-1]
    for tail in tails:
      tail.append(move_tail(*prev, *tail[-1]))
      prev = tail[-1]
  return rope

rope = [[(0, 0)] for _ in range(10)]
for m in moves:
  rope = move(rope, *m)

print("Part 1:", len(set(rope[1])))
print("Part 2:", len(set(rope[-1])))