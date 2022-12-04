import re
assignments = [list(map(int, re.split(r"[,-]", line))) for line in open("input.txt").read().split("\n")]
print("Part 1:", len([1 for [a, b, c, d] in assignments if (a <= c and b >= d) or (c <= a and d >= b)]))
print("Part 2:", len([1 for [a, b, c, d] in assignments if (c <= a <= d) or (c <= b <= d) or (a <= c <= b) or (a <= d <= b)]))