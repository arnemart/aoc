def sum_elf(e):
  return sum(map(int, e.split("\n")))

with open("input.txt") as f:
  elves = sorted(map(sum_elf, f.read().split("\n\n")))

print("Part 1:", elves[-1])
print("Part 2:", sum(elves[-3:]))
