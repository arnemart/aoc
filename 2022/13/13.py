import json
from functools import cmp_to_key

def compr(l, r):
  match [l, r]:
    case [[], []]: return 0
    case [[], _]: return -1
    case [_, []]: return 1
    case [a, b] if type(a) == int and type(b) == int: return a - b
    case [a, b] if type(a) == int and type(b) == list: return compr([a], b)
    case [a, b] if type(a) == list and type(b) == int: return compr(a, [b])
    case [[a, *aa], [b, *bb]]: return compr(a, b) or compr(aa, bb)

packets = [json.loads(line) for line in open("input.txt").read().splitlines() if line != ""]
pairs = [[packets[i], packets[i+1]] for i in range(0, len(packets), 2)]

print("Part 1:", sum(i + 1 if compr(*pairs[i]) < 0 else 0 for i in range(len(pairs))))

dp1, dp2 = [[2]], [[6]]
packets += [dp1, dp2]
packets.sort(key=cmp_to_key(compr))

print("Part 2:", (packets.index(dp1) + 1) * (packets.index(dp2) + 1))