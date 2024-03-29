import re
assignments = [list(map(int, re.findall(r"\d+", line))) for line in open("input.txt")]
print("Part 1:", len([1 for [a, b, c, d] in assignments if (a<=c<=d<=b) or (c<=a<=b<=d)]))
print("Part 2:", len([1 for [a, b, c, d] in assignments if any([c<=a<=d, c<=b<=d, a<=c<=b, a<=d<=b])]))