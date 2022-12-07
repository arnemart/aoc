import re

cmds = open("input.txt").read().splitlines()

folders = {}
path = ()

for cmd in cmds:
  if cmd == "$ cd ..":
    path = path[:-1]
  elif cmd.startswith("$ cd"):
    path = (*path, cmd.split(" ")[-1])
  elif re.match(r"^\d+", cmd):
    size = int(cmd.split(" ")[0])
    for i in range(len(path), 0, -1):
      folders[path[:i]] = size + folders.get(path[:i], 0)

print("Part 1:", sum(f for f in folders.values() if f <= 100000))
print("Part 2:", min(f for f in folders.values() if f >= 30000000 - (70000000 - folders[("/",)])))