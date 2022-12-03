def priority(s):
  i = ord(s)
  return i - (96 if (i > 96) else 38)

backpacks = [list(line.strip()) for line in open("input.txt")]

compartments = [[set(bp[0:len(bp) // 2]), set(bp[len(bp) // 2:])] for bp in backpacks]
overlaps = [list(a.intersection(b))[0] for [a, b] in compartments]
print("Part 1:", sum(priority(x) for x in overlaps))

groups = [map(set, backpacks[i * 3:i * 3 + 3]) for i in range(len(backpacks) // 3)]
overlaps2 = [list(a.intersection(b).intersection(c))[0] for [a, b, c] in groups]
print("Part 2:", sum(priority(x) for x in overlaps2))