import json
from functools import cmp_to_key

def compr(l, r):
  match [l, r]:
    case [None, _]: return -1
    case [_, None]: return 1
    case [[], []]: return 0
    case [[], _]: return -1
    case [_, []]: return 1
    case [a, b] if type(a) == int and type(b) == int: return 0 if a == b else [1, -1][a < b]
    case [a, b] if type(a) == int and type(b) == list: return compr([a], b)
    case [a, b] if type(a) == list and type(b) == int: return compr(a, [b])
    case [[a, *aa], [b, *bb]]: return compr(a, b) or compr(aa, bb)

packets = [json.loads(line) for line in open("input.txt").read().splitlines() if line != ""]
pairs = [[packets[i], packets[i+1]] for i in range(0, len(packets), 2)]

print("Part 1:", sum(i + 1 if compr(*pairs[i]) == -1 else 0 for i in range(len(pairs))))

packets.append([[2]])
packets.append([[6]])
packets.sort(key=cmp_to_key(compr))

print("Part 2:", (packets.index([[2]]) + 1) * (packets.index([[6]]) + 1))