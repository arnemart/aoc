l=[int(x)for x in open("a").read().split()]
s=sorted
a=s(l[::2])
b=s(l[1::2])
print(sum(abs(x-y) for x,y in zip(a,b)),sum(x*b.count(x)for x in a))