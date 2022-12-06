signal = open("input.txt").read()

def find_marker(signal, distinct):
  for i in range(len(signal)):
    if len(set(signal[i:i + distinct])) == distinct:
      return i + distinct

print("Part 1:", find_marker(signal, 4))
print("Part 2:", find_marker(signal, 14))