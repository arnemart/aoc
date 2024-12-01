a,b=[sorted(l[n]for l in[list(map(int,s.split()))for s in open("a")])for n in(0,1)]
print(sum((abs(x-y))for x,y in zip(a,b)),sum(x*b.count(x)for x in a))