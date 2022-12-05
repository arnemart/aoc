import re

[stacksinput, opsinput] = [s.splitlines() for s in open("input.txt").read().split("\n\n")]
crate_indices = [match.span()[0] for match in re.finditer(r"\d", stacksinput[-1])]

stacks = [list(filter(lambda s: s != " ", stack)) 
  for stack in zip(*[list(map(lambda i: row[i], crate_indices)) 
  for row in stacksinput[:-1]])]

ops = [[int(n), int(f) - 1, int(t) - 1]
  for n, f, t in [re.findall(r"\d+", op) for op in opsinput]]

def move(stacks, op, reverse=True):
  to_add = stacks[op[1]][0:op[0]]
  if reverse:
    to_add.reverse()
  stacks[op[2]] = to_add + stacks[op[2]]
  stacks[op[1]] = stacks[op[1]][op[0]:]
  return stacks

stacks2 = stacks.copy()

for op in ops:
  stacks = move(stacks, op)
  stacks2 = move(stacks2, op, reverse=False)

print("Part 1:", "".join([stack[0] for stack in stacks]))
print("Part 2:", "".join([stack[0] for stack in stacks2]))