with open("input.txt") as f:
  strategy = list(map(lambda s: s.split(" "), f.read().split("\n")))

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

print("Part 1:", sum(map(lambda x: scores1[x[0]][x[1]], strategy)))
print("Part 2:", sum(map(lambda x: scores2[x[0]][x[1]], strategy)))
