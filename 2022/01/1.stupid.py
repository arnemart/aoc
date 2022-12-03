a=sorted(sum(map(int,e.split())) for e in open("input.txt").read().split("\n\n"))
print(a[-1],sum(a[-3:]))