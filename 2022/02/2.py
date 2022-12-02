strategy = [s.split(" ") for s in open("input.txt").read().split("\n")]

scores1 = {
  "A": { "X": 4, "Y": 8, "Z": 3 },
  "B": { "X": 1, "Y": 5, "Z": 9 },
  "C": { "X": 7, "Y": 2, "Z": 6 }
}

scores2 = {
  "A": { "X": 3, "Y": 4, "Z": 8 },
  "B": { "X": 1, "Y": 5, "Z": 9 },
  "C": { "X": 2, "Y": 6, "Z": 7 }
}

print("Part 1:", sum([scores1[x][y] for [x, y] in strategy]))
print("Part 2:", sum([scores2[x][y] for [x, y] in strategy]))
